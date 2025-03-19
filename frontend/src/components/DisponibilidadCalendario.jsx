import { useState, useEffect } from 'react'
import { Calendar, Card, CardBody, Button } from '@heroui/react'
import { Clock, Users } from 'lucide-react'
import { today, getLocalTimeZone } from '@internationalized/date'
import { Link } from 'react-router-dom'

const DisponibilidadCalendario = ({ tour, onSelectDate }) => {
  // Estado para manejar las disponibilidades procesadas
  const [availabilities, setAvailabilities] = useState([])
  const [selectedDateRange, setSelectedDateRange] = useState(null)
  const [selectedAvailability, setSelectedAvailability] = useState(null)

  // Procesamiento inicial de datos de disponibilidad
  useEffect(() => {
    if (tour?.availability) {
      const availabilityArray = Array.isArray(tour.availability) ? tour.availability : [tour.availability].filter(Boolean)

      const processedAvailabilities = availabilityArray
        .map(avail => {
          try {
            // Crear objetos Date directamente desde las fechas ISO completas
            const departureDateTime = avail.departureTime ? new Date(avail.departureTime) : null
            const returnDateTime = avail.returnTime ? new Date(avail.returnTime) : null

            if (!departureDateTime || isNaN(departureDateTime.getTime()) || !returnDateTime || isNaN(returnDateTime.getTime())) {
              console.warn('Fechas inválidas en disponibilidad:', avail)
              return null
            }

            // Crear fechas UTC sin hora para comparaciones de calendario
            const departureDate = new Date(
              Date.UTC(departureDateTime.getFullYear(), departureDateTime.getMonth(), departureDateTime.getDate())
            )

            const returnDate = new Date(Date.UTC(returnDateTime.getFullYear(), returnDateTime.getMonth(), returnDateTime.getDate()))

            return {
              id: avail.id,
              departureDate: departureDate,
              returnDate: returnDate,
              departureTime: departureDateTime,
              returnTime: returnDateTime,
              availableSlots: avail.availableSlots || 0,
              bookUntilDate: avail.availableDate ? new Date(avail.availableDate) : null,
              originalData: avail
            }
          } catch (error) {
            console.error('Error procesando fecha de disponibilidad:', error)
            return null
          }
        })
        .filter(Boolean)

      setAvailabilities(processedAvailabilities)
    }
  }, [tour])

  // Funciones auxiliares para el manejo de fechas
  const isDateInAvailabilityRange = dateObj => {
    // Crear fecha UTC para comparación consistente con las fechas de disponibilidad
    const date = new Date(Date.UTC(dateObj.year, dateObj.month - 1, dateObj.day))

    return availabilities.some(avail => {
      const isInRange = date >= avail.departureDate && date <= avail.returnDate
      return isInRange
    })
  }

  const getAvailabilityForDate = dateObj => {
    // Crear fecha UTC para comparación consistente
    const date = new Date(Date.UTC(dateObj.year, dateObj.month - 1, dateObj.day))

    return availabilities.find(avail => date >= avail.departureDate && date <= avail.returnDate)
  }

  const isDateUnavailable = dateObj => {
    // Crear fecha UTC para comparación consistente
    const date = new Date(Date.UTC(dateObj.year, dateObj.month - 1, dateObj.day))

    // Normalizar fecha actual a UTC sin hora para comparación justa
    const nowDate = new Date()
    const nowDateUtc = new Date(Date.UTC(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()))

    // Las fechas pasadas no están disponibles (excepto el día actual)
    if (date < nowDateUtc) {
      return true
    }

    // Si no está en ningún rango de disponibilidad, también está no disponible
    return !isDateInAvailabilityRange(dateObj)
  }

  // Manejador de selección de fecha
  const handleDateSelect = dateObj => {
    const availability = getAvailabilityForDate(dateObj)

    if (availability) {
      const selectedDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
      setSelectedDateRange({
        start: availability.departureDate,
        end: availability.returnDate
      })
      setSelectedAvailability(availability)

      onSelectDate?.({
        availability,
        selectedDate,
        range: {
          start: availability.departureDate,
          end: availability.returnDate
        }
      })
    }
  }

  // Formateadores de fecha y hora
  const formatDate = date => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = date => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="mb-4 overflow-hidden shadow-sm">
      <CardBody className="p-4">
        {/* Calendario */}
        <div className="mb-4 flex justify-center">
          <Calendar
            aria-label="Calendario de disponibilidad"
            isDateUnavailable={isDateUnavailable}
            onChange={handleDateSelect}
            defaultFocusedValue={today(getLocalTimeZone())}
            calendarWidth={340}
            visibleMonths={1}
            renderCell={(date, cellState) => {
              const isAvailable = !isDateUnavailable(date)
              const availability = isAvailable ? getAvailabilityForDate(date) : null

              // Crear objeto Date UTC para comparaciones precisas
              const cellDate = new Date(Date.UTC(date.year, date.month - 1, date.day))

              // Verificar inicio y fin comparando fechas completas con getTime()
              const isStart = availability && cellDate.getTime() === availability.departureDate.getTime()

              const isEnd = availability && cellDate.getTime() === availability.returnDate.getTime()

              // Destacar fechas de inicio y fin con colores diferentes
              let cellStyle = ''
              if (isStart) cellStyle = 'bg-red-500 text-white rounded-l-full'
              else if (isEnd) cellStyle = 'bg-red-500 text-white rounded-r-full'
              else if (isAvailable) cellStyle = 'bg-red-100'

              return <div className={`w-10 h-10 flex items-center justify-center ${cellStyle}`}>{date.day}</div>
            }}
          />
        </div>

        {/* Mensaje cuando no hay fecha seleccionada */}
        {!selectedAvailability && (
          <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-3">calendar_month</span>
            <p className="text-gray-600 font-medium">Selecciona una fecha disponible</p>
            <p className="text-gray-500 text-sm mt-2">
              Podras ver los detalles de disponibilidad de este tour, y continuar el proceso de reserva
            </p>
          </div>
        )}

        {/* Panel de detalles cuando hay fecha seleccionada */}
        {selectedAvailability && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-lg text-primary mb-3">Detalles de la fecha</h4>
            <div className="space-y-3">
              {/* Fecha de salida */}
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-2 text-gray-500">event</span>
                <div>
                  <span className="font-medium">Salida:</span> {formatDate(selectedAvailability.departureTime)}{' '}
                  <span className="text-primary font-medium">{formatTime(selectedAvailability.departureTime)}</span>
                </div>
              </div>

              {/* Fecha de regreso */}
              <div className="flex items-center">
                <span className="material-symbols-outlined mr-2 text-gray-500">today</span>
                <div>
                  <span className="font-medium">Regreso:</span> {formatDate(selectedAvailability.returnTime)}{' '}
                  <span className="text-primary font-medium">{formatTime(selectedAvailability.returnTime)}</span>
                </div>
              </div>

              {/* Cupos disponibles */}
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <span className="font-medium">Cupos disponibles:</span>{' '}
                  <span className="text-primary font-medium">{selectedAvailability.availableSlots}</span>
                </div>
              </div>

              {/* Fecha límite de reserva */}
              {selectedAvailability.bookUntilDate && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  <div>
                    <span className="font-medium">Reservas hasta:</span>{' '}
                    <span className="font-medium">{formatDate(selectedAvailability.bookUntilDate)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de reserva */}
            <Link to={`/tour/${tour.id}/confirm`} state={{ tour: tour, availability: selectedAvailability }}>
              <Button className="w-full mt-4 bg-[#E86C6E] hover:bg-red-600 text-white text-md font-medium py-3 rounded-lg shadow-sm transition-colors">
                Iniciar reserva
              </Button>
            </Link>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default DisponibilidadCalendario
