import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem, DatePicker } from '@heroui/react'
import { getLocalTimeZone } from '@internationalized/date'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { useDateFormatter } from '@react-aria/i18n'
import { useAuth } from '@context/AuthContext.jsx'

export default function ConfirmReserv() {
  const location = useLocation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tour } = location.state || {}

  // State for loading and error handling
  const [loading, setLoading] = useState(!tour && !!id)
  const [error, setError] = useState(null)

  // Validación de autenticación
  useEffect(() => {
    if (!user) {
      navigate('/login', {
        state: {
          from: `/tour/${id}/confirm`,
          message: 'Debes iniciar sesión para completar tu reserva'
        }
      })
    }
  }, [user, navigate, id])

  // Fetch tour data if not available in location state
  useEffect(() => {
    const fetchTourData = async () => {
      if (!tour && id) {
        try {
          setLoading(true)
          setError(null)

          const URL = import.meta.env.VITE_URL_BACK
          const response = await fetch(`${URL}/tours/${id}`)

          if (!response.ok) {
            throw new Error(`Error fetching tour: ${response.status}`)
          }

          const tourData = await response.json()
          setTourData(tourData)
        } catch (error) {
          console.error('Error loading tour data:', error)
          setError(error.message || 'Failed to load tour data')
        } finally {
          setLoading(false)
        }
      }
    }

    if (!tour && id) {
      fetchTourData()
    }
  }, [id, tour])

  // State to hold tour data if fetched separately
  const [tourData, setTourData] = useState(null)

  // Use either the tour from location state or the fetched data
  const tourInfo = tour || tourData

  // ➡️ State Variables
  const [selectedAdults, setSelectedAdults] = useState('')
  const [selectedChildren, setSelectedChildren] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHour, setSelectedHour] = useState('')

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')

  const numbers = Array.from({ length: 10 }, (_, i) => ({
    key: `${i + 1}`,
    label: `${i + 1}`,
    value: i + 1
  }))

  const handleAdultsSelectionChange = e => {
    setSelectedAdults(e.target.value)
  }

  const handleChildrenSelectionChange = e => {
    setSelectedChildren(e.target.value)
  }

  const handleDateSelectionChange = e => {
    formatter.format(e.toDate(getLocalTimeZone()))
    setSelectedDate(formatter.format(e.toDate(getLocalTimeZone())))
  }

  let formatter = useDateFormatter({ dateStyle: 'full' })

  // ➡️ Dynamic Price Calculation (guard for null)
  const adultPrice = tourInfo?.adultPrice || 0
  const childPrice = tourInfo?.childPrice || 0

  const adultsCount = selectedAdults || 0
  const childrenCount = selectedChildren || 0
  const totalPrice = adultsCount * adultPrice + childrenCount * childPrice

  // Handle form submission
  const handleConfirmReservation = async () => {
    // You would typically send this data to your backend
    const reservationData = {
      tourId: tourInfo?.id,
      firstName,
      lastName,
      email,
      country,
      adults: adultsCount,
      children: childrenCount,
      date: selectedDate,
      hour: selectedHour,
      totalPrice
    }

    console.log('Submitting reservation:', reservationData)

    // Here you would add your API call
    // Example:
    // try {
    //   const response = await fetch(`${URL}/reservations`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(reservationData)
    //   })
    //
    //   if (response.ok) {
    //     navigate('/reservation-success')
    //   }
    // } catch (error) {
    //   console.error('Reservation failed:', error)
    // }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-xl">Cargando información del tour...</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-2xl text-red-600 mb-4">Error</h1>
        <p className="text-lg">{error}</p>
        <Button className="mt-6" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    )
  }

  // Show error if tour info is not available
  if (!tourInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-2xl mb-4">Tour no encontrado</h1>
        <p className="text-lg">No se pudo encontrar la información del tour.</p>
        <Button className="mt-6" onClick={() => navigate('/')}>
          Volver al inicio
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <h1>
            {tourInfo?.name || 'Tour'}
            {tourInfo?.destination?.city?.name ? `. ${tourInfo.destination.city.name}.` : ''}
          </h1>
        </CardHeader>
        <CardBody>
          <h2>Confirmación de Detalles.</h2>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="w-full lg:w-1/2 flex flex-col gap-4 text-sm">
              <Input
                size="sm"
                labelPlacement="outside"
                label="Nombre"
                id="first-name"
                placeholder="Ingrese su nombre"
                className="w-full text-sm"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />

              <Input
                size="sm"
                labelPlacement="outside"
                label="Apellido"
                id="last-name"
                placeholder="Ingrese su apellido"
                className="w-full text-sm"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />

              <Input
                size="sm"
                labelPlacement="outside"
                label="Correo Electronico"
                id="email"
                type="email"
                placeholder="Ingrese su Correo Electronico"
                className="w-full text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <Input
                size="sm"
                labelPlacement="outside"
                label="Pais"
                id="country"
                placeholder="Ingrese su Pais"
                className="w-full text-sm"
                value={country}
                onChange={e => setCountry(e.target.value)}
              />

              <div className="flex flex-col md:flex-row gap-4">
                <Select
                  className="w-full max-w-xs text-sm"
                  size="sm"
                  items={numbers}
                  label="Adultos"
                  labelPlacement="outside"
                  placeholder="Elegir cantidad adultos"
                  selectedKeys={selectedAdults ? [`${selectedAdults}`] : []}
                  onChange={handleAdultsSelectionChange}>
                  {number => <SelectItem key={number.key}>{number.label}</SelectItem>}
                </Select>

                <Select
                  className="w-full max-w-xs text-sm"
                  size="sm"
                  items={numbers}
                  label="Niños"
                  labelPlacement="outside"
                  placeholder="Elegir cantidad niños"
                  selectedKeys={selectedChildren ? [`${selectedChildren}`] : []}
                  onChange={handleChildrenSelectionChange}>
                  {number => <SelectItem key={number.key}>{number.label}</SelectItem>}
                </Select>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-end">
              <img
                src={tourInfo?.images?.[0] || 'https://via.placeholder.com/500x400'}
                alt="Tour"
                className="rounded-xl w-full h-auto max-h-[500px] object-cover shadow-lg"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl text-sm">
        <Card className="flex-1">
          <CardHeader>
            <p>Seleccionar Fecha y Hora de llegada</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <h1 className="text-base font-medium">Fecha de llegada</h1>
              <DatePicker className="max-w-[284px]" locale="es-ES" label="Fecha de llegada" onChange={handleDateSelectionChange} />

              <h1 className="text-base font-medium">Hora de llegada</h1>
              <Input size="sm" label="Hora de llegada" type="time" onChange={e => setSelectedHour(e.target.value)} />
            </div>
          </CardBody>
        </Card>

        <Card className="flex-1 flex flex-col justify-between">
          <CardHeader>
            <p>Total & Confirmación</p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <div className="text-3xl font-semibold">${totalPrice.toFixed(2)}</div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Fecha de llegada:</strong> {selectedDate || 'No seleccionado'}
              </p>
              <p>
                <strong>Hora de llegada:</strong> {selectedHour || 'No seleccionado'}
              </p>
              <p>
                <strong>Adultos:</strong> {adultsCount}
              </p>
              <p>
                <strong>Niños:</strong> {childrenCount}
              </p>
            </div>

            <Button
              className="w-full"
              size="lg"
              color="primary"
              onPress={handleConfirmReservation}
              disabled={!selectedDate || !selectedHour || !adultsCount || !firstName || !lastName || !email}>
              Confirmar Registro
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card className="w-full max-w-5xl text-sm">
        <CardHeader>
          <p>Consideraciones</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <p>🕒 Check-in desde 2:00 PM</p>
          <p>🕛 Check-out desde 12:00 PM</p>
          <p>🚭 No fumar</p>
          <p>🐾 Mascotas no estan permitidas</p>
          <p>❗La cancelación dentro de las 48 horas puede generar cargos.</p>
        </CardBody>
      </Card>
    </div>
  )
}
