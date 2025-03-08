import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DetalleGallery from '@components/DetalleGallery'
import BodyDetalle from '@components/BodyDetalle'

const DetalleTour = () => {
  const { id } = useParams()
  const [tour, setTour] = useState(null)
  const URL = import.meta.env.VITE_URL_BACK

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`${URL}/tours/${id}`)
        if (!response.ok) throw new Error('Error al cargar datos')

        const data = await response.json()
        const tourEncontrado = data
        console.log('Tour encontrado', tourEncontrado)

        setTour(tourEncontrado)
      } catch (error) {
        console.log('Error', error)
      }
    }
    fetchTour()
  }, [URL, id])

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
        <p className="text-center mt-10">Cargando...</p>
      )}
    </div>
  )
}

export default DetalleTour
