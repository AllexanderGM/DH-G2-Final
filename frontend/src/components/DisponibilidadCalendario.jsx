import { useState, useEffect } from 'react'
import { Calendar, Card, CardHeader, CardBody, Button } from '@heroui/react'
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Users } from 'lucide-react'
import { today, getLocalTimeZone } from '@internationalized/date'

const DisponibilidadCalendario = ({ tour, onSelectDate }) => {
  const [availabilities, setAvailabilities] = useState([])
  const [selectedDateRange, setSelectedDateRange] = useState(null)
  const [selectedAvailability, setSelectedAvailability] = useState(null)

  useEffect(() => {
    if (tour?.availability) {
      const availabilityArray = Array.isArray(tour.availability) ? tour.availability : [tour.availability].filter(Boolean)

      const processedAvailabilities = availabilityArray
        .map(avail => {
          try {
            let departureDate = null
            let returnDate = null

            if (avail.departureTime) {
              const departureDateString = avail.departureTime.split('T')[0]
              departureDate = new Date(`${departureDateString}T00:00:00`)
            }

            if (avail.returnTime) {
              const returnDateString = avail.returnTime.split('T')[0]
              returnDate = new Date(`${returnDateString}T00:00:00`)
            }

            if (!departureDate || isNaN(departureDate.getTime()) || !returnDate || isNaN(returnDate.getTime())) {
              return null
            }

            const departureTime = avail.departureTime ? new Date(avail.departureTime) : null
            const returnTime = avail.returnTime ? new Date(avail.returnTime) : null

            return {
              id: avail.id,
              departureDate,
              returnDate,
              departureTime,
              returnTime,
              availableSlots: avail.availableSlots || 0,
              bookUntilDate: avail.availableDate ? new Date(avail.availableDate) : null,
              originalData: avail
            }
          } catch (error) {
            return null
          }
        })
        .filter(Boolean)

      setAvailabilities(processedAvailabilities)
    }
  }, [tour])

  const isDateInAvailabilityRange = dateObj => {
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
    return availabilities.some(avail => date >= avail.departureDate && date <= avail.returnDate)
  }

  const getAvailabilityForDate = dateObj => {
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
    return availabilities.find(avail => date >= avail.departureDate && date <= avail.returnDate)
  }

  const isDateUnavailable = dateObj => {
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
    const nowDate = new Date()

    if (date < nowDate && date.toDateString() !== nowDate.toDateString()) {
      return true
    }

    return !isDateInAvailabilityRange(dateObj)
  }

  const handleDateSelect = dateObj => {
    const availability = getAvailabilityForDate(dateObj)

    if (availability) {
      const selectedDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
      const range = {
        start: availability.departureDate,
        end: availability.returnDate
      }

      setSelectedDateRange(range)
      setSelectedAvailability(availability)

      if (onSelectDate) {
        onSelectDate({
          availability,
          selectedDate,
          range
        })
      }
    }
  }

  // Función para formatear fechas en español
  const formatDate = date => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Función para formatear hora
  const formatTime = date => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="mb-4 overflow-hidden shadow-sm">
      <CardBody className="p-4">
        <div className="mb-4">
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
              const isStart = availability?.departureDate?.getDate() === date.day
              const isEnd = availability?.returnDate?.getDate() === date.day

              // Destacar fechas de inicio y fin con colores diferentes
              let cellStyle = ''
              if (isStart) cellStyle = 'bg-red-500 text-white rounded-l-full'
              else if (isEnd) cellStyle = 'bg-red-500 text-white rounded-r-full'
              else if (isAvailable) cellStyle = 'bg-red-100'

              return <div className={`w-10 h-10 flex items-center justify-center ${cellStyle}`}>{date.day}</div>
            }}
          />
        </div>

        {selectedAvailability && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-lg text-primary mb-3">Detalles de la fecha</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <span className="font-medium">Salida:</span> {formatDate(selectedAvailability.departureTime)}{' '}
                  <span className="text-primary font-medium">{formatTime(selectedAvailability.departureTime)}</span>
                </div>
              </div>

              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <span className="font-medium">Regreso:</span> {formatDate(selectedAvailability.returnTime)}{' '}
                  <span className="text-primary font-medium">{formatTime(selectedAvailability.returnTime)}</span>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <span className="font-medium">Cupos disponibles:</span>{' '}
                  <span className="text-primary font-medium">{selectedAvailability.availableSlots}</span>
                </div>
              </div>

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
          </div>
        )}

        {selectedAvailability && (
          <Button
            className="w-full mt-4 bg-[#E86C6E] hover:bg-red-600 text-white text-md font-medium py-3 rounded-lg shadow-sm transition-colors"
            onPress={() => console.log('Iniciar reserva', selectedAvailability)}>
            Iniciar reserva
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default DisponibilidadCalendario
