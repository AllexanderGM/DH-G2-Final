import React, { useState, useEffect } from 'react'
import { Calendar, Button, Badge } from '@heroui/react'
import { today, getLocalTimeZone } from '@internationalized/date'

const DisponibilidadCalendario = ({ tour, onSelectDate }) => {
  const [availabilities, setAvailabilities] = useState([])
  const [selectedDateRange, setSelectedDateRange] = useState(null)
  const [selectedAvailability, setSelectedAvailability] = useState(null)

  useEffect(() => {
    console.log('Tour completo recibido en DisponibilidadCalendario:', tour)
    console.log('Datos de disponibilidad recibidos en DisponibilidadCalendario:', tour?.availability)

    if (tour && tour.availability) {
      console.log('Array de disponibilidad recibido:', tour.availability)
      // Asegurarnos de que availability sea un array
      const availabilityArray = Array.isArray(tour.availability) ? tour.availability : [tour.availability].filter(Boolean)

      console.log('Datos de disponibilidad procesados:', availabilityArray)

      // Procesar las fechas de disponibilidad
      // En DisponibilidadCalendario.jsx, modificar el procesamiento de fechas:
      const processedAvailabilities = availabilityArray
        .map(avail => {
          try {
            let departureDate = null
            let returnDate = null

            if (avail.departureTime) {
              // Extraer solo la parte de fecha, ignorando la hora
              const departureDateString = avail.departureTime.split('T')[0]
              departureDate = new Date(departureDateString + 'T00:00:00')
            }

            if (avail.returnTime) {
              // Hacer lo mismo con la fecha de regreso para consistencia
              const returnDateString = avail.returnTime.split('T')[0]
              returnDate = new Date(returnDateString + 'T00:00:00')
            }

            // Verificar si las fechas son válidas
            if (!departureDate || isNaN(departureDate.getTime())) {
              console.warn('Fecha de salida inválida:', avail.departureTime)
              return null
            }

            if (!returnDate || isNaN(returnDate.getTime())) {
              console.warn('Fecha de regreso inválida:', avail.returnTime)
              return null
            }

            // Guardar la hora original para mostrarla correctamente
            const departureTime = avail.departureTime ? new Date(avail.departureTime) : null
            const returnTime = avail.returnTime ? new Date(avail.returnTime) : null

            return {
              id: avail.id,
              departureDate, // Fecha normalizada (solo fecha, sin hora)
              returnDate, // Fecha normalizada (solo fecha, sin hora)
              departureTime, // Fecha+hora original para mostrar
              returnTime, // Fecha+hora original para mostrar
              availableSlots: avail.availableSlots || 0,
              bookUntilDate: avail.availableDate ? new Date(avail.availableDate) : null,
              originalData: avail
            }
          } catch (error) {
            console.error('Error procesando fechas de disponibilidad:', error, avail)
            return null
          }
        })
        .filter(Boolean)

      console.log('Disponibilidades procesadas:', processedAvailabilities)
      setAvailabilities(processedAvailabilities)
    }
  }, [tour])

  // Comprobar si una fecha está dentro de algún rango de disponibilidad
  const isDateInAvailabilityRange = dateObj => {
    // Convertir de formato internationalized a Date JS
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day)

    return availabilities.some(avail => {
      // Verificar si la fecha está dentro del rango de salida y regreso
      return date >= avail.departureDate && date <= avail.returnDate
    })
  }

  // Obtener la disponibilidad para una fecha específica
  const getAvailabilityForDate = dateObj => {
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day)

    return availabilities.find(avail => date >= avail.departureDate && date <= avail.returnDate)
  }

  // Función para deshabilitar fechas no disponibles
  const isDateUnavailable = dateObj => {
    // Desactivar fechas pasadas
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
    const nowDate = new Date()

    if (date < nowDate && date.toDateString() !== nowDate.toDateString()) {
      return true
    }

    // Desactivar fechas sin disponibilidad
    return !isDateInAvailabilityRange(dateObj)
  }

  // Manejar la selección de fecha
  const handleDateSelect = dateObj => {
    const availability = getAvailabilityForDate(dateObj)

    if (availability) {
      // Convertir la fecha seleccionada a Date JS
      const selectedDate = new Date(dateObj.year, dateObj.month - 1, dateObj.day)

      // Crear el rango de fechas seleccionado
      const range = {
        start: availability.departureDate,
        end: availability.returnDate
      }

      setSelectedDateRange(range)
      setSelectedAvailability(availability)

      // Llamar al callback con la información de la disponibilidad
      if (onSelectDate) {
        onSelectDate({
          availability,
          selectedDate,
          range
        })
      }

      console.log('Fecha seleccionada:', selectedDate)
      console.log('Rango completo:', range)
      console.log('Disponibilidad seleccionada:', availability)
    }
  }

  return (
    <div className="rounded-lg bg-white p-2 px-12">
      <div className="mb-4">
        <Calendar aria-label="Calendario de disponibilidad" isDateUnavailable={isDateUnavailable} onChange={handleDateSelect} />
      </div>

      {selectedAvailability && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-primary">Detalles de la fecha</h4>
          <div className="mt-2 space-y-2 text-sm">
            <p>
              <span className="font-medium">Salida:</span>{' '}
              {selectedAvailability.departureTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}{' '}
              {selectedAvailability.departureTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p>
              <span className="font-medium">Regreso:</span>{' '}
              {selectedAvailability.returnTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}{' '}
              {selectedAvailability.returnTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p>
              <span className="font-medium">Cupos disponibles:</span> {selectedAvailability.availableSlots}
            </p>
            {selectedAvailability.bookUntilDate && (
              <p>
                <span className="font-medium">Reservas hasta:</span>{' '}
                {selectedAvailability.bookUntilDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DisponibilidadCalendario
