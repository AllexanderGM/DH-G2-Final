import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DetalleGallery from '@components/DetalleGallery'
import BodyDetalle from '@components/BodyDetalle'

const DetalleTour = () => {
  const { id } = useParams()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const URL = import.meta.env.VITE_URL_BACK

  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`Obteniendo datos del tour ID: ${id}`)
        const response = await fetch(`${URL}/tours/${id}`)

        if (!response.ok) {
          throw new Error(`Error al cargar datos: ${response.status}`)
        }

        const data = await response.json()
        console.log('Tour completo obtenido:', data)

        // Verificar específicamente los datos de disponibilidad
        console.log('Datos de disponibilidad en respuesta:', data.availability)

        // Normalizar la estructura de availability si es necesario
        let normalizedAvailability = data.availability
        if (normalizedAvailability && !Array.isArray(normalizedAvailability)) {
          normalizedAvailability = [normalizedAvailability]
          console.log('Normalizada la disponibilidad a array:', normalizedAvailability)
        }

        // Crear un objeto de tour normalizado con los datos
        const tourNormalizado = {
          ...data,
          availability: normalizedAvailability || []
        }

        console.log('Tour normalizado para pasar a componentes hijos:', tourNormalizado)
        setTour(tourNormalizado)
      } catch (error) {
        console.error('Error obteniendo tour:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [URL, id])

  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-100 mb-28">
      {tour ? (
        <>
          <div className="flex justify-between items-center h-[100px]">
            <h1>
              {tour.name}. {tour.destination.city.name}.
            </h1>
            <Link to="/">
              <span
                className="material-symbols-outlined text-2xl text-gray-500 transition-all duration-200 hover:text-gray-900 hover:text-3xl"
                width="100%">
                arrow_back_ios
              </span>
            </Link>
          </div>

          <DetalleGallery tour={tour} />
          <BodyDetalle tour={tour} />
        </>
      ) : (
        <p className="text-center mt-10">No se encontraron datos del tour</p>
      )}
    </div>
  )
}

export default DetalleTour
