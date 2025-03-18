import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardFooter, CardBody, Button, Spinner } from '@heroui/react'
import DisponibilidadCalendario from './DisponibilidadCalendario'
// Eliminamos la importación de getTourById que ya no usaremos
// import { getTourById } from '../services/tourService'

const CardDetalle = ({ tour, onReservar }) => {
  const [loading, setLoading] = useState(false)
  const [disponibilidad, setDisponibilidad] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tour || !tour.id) return

    setLoading(true)
    try {
      console.log('Tour recibido en CardDetalle:', tour)
      console.log('Disponibilidad recibida en CardDetalle:', tour.availability)

      // Usar los datos de disponibilidad ya obtenidos en el tour
      if (tour.availability) {
        // Asegurarnos de que disponibilidad sea un array
        const availabilityArray = Array.isArray(tour.availability) ? tour.availability : [tour.availability].filter(Boolean)

        console.log('Array de disponibilidad procesado en CardDetalle:', availabilityArray)

        // Ordenar las fechas de disponibilidad
        const availabilityOrdenada = [...availabilityArray].sort((a, b) => {
          const dateA = new Date(a.departureTime || a.availableDate || 0)
          const dateB = new Date(b.departureTime || b.availableDate || 0)
          return dateA - dateB
        })

        console.log('Disponibilidad ordenada en CardDetalle:', availabilityOrdenada)
        setDisponibilidad(availabilityOrdenada)
      } else {
        console.warn('No se encontraron datos de disponibilidad en el tour')
        setDisponibilidad([])
      }
    } catch (err) {
      console.error('Error procesando disponibilidad:', err)
      setError('No se pudo procesar la disponibilidad. Intente más tarde.')
    } finally {
      setLoading(false)
    }
  }, [tour])

  const handleDateSelected = dateInfo => {
    setSelectedDate(dateInfo)
    console.log('Fecha seleccionada en CardDetalle:', dateInfo)

    if (onReservar) {
      onReservar({
        tour,
        fechaSeleccionada: dateInfo
      })
    }
  }

  // Para la demostración, si no tenemos tour, creamos uno de ejemplo
  const demoTour = {
    id: 1,
    name: 'Tour al Valle del Aconcagua',
    adultPrice: 69.99,
    childPrice: 39.99,
    description: 'Descubre la belleza natural del Valle del Aconcagua con este tour de día completo',
    images: ['https://via.placeholder.com/800x600?text=Valle+del+Aconcagua'],
    destination: {
      country: 'Chile',
      city: { name: 'Valparaíso' }
    }
  }

  const tourToUse = tour || demoTour

  return (
    <div className="rounded-lg">
      <Card className="py-3 px-4">
        <CardHeader className="pb-0 pt-2 px-4 mb-2 flex flex-col items-center justify-center">
          <div className="font-semibold text-lg text-gray-800">Reserva tu experiencia</div>
          <div className="flex justify-between w-full mt-2">
            <div className="text-sm text-gray-500">
              Desde <span className="font-medium text-black">${tourToUse.childPrice}</span> niño
            </div>
            <div className="text-sm text-gray-500">
              Desde <span className="font-medium text-black">${tourToUse.adultPrice}</span> adulto
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-visible py-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner color="primary" size="lg" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
              <Button variant="flat" color="primary" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          ) : (
            <DisponibilidadCalendario tour={{ ...tourToUse, availability: disponibilidad }} onSelectDate={handleDateSelected} />
          )}
        </CardBody>

        <CardFooter className="px-4 mt-2">
          <Button
            color="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-red-400 to-red-600 hover:opacity-90 transition-opacity"
            disabled={!selectedDate}
            onClick={() => handleDateSelected(selectedDate)}>
            <div className="text-lg">{selectedDate ? 'Iniciar reserva' : 'Selecciona una fecha'}</div>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CardDetalle
