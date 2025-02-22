import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Image } from '@heroui/react'

const DetalleTour = () => {
  const { id } = useParams()
  const [tour, setTour] = useState(null)
  const URL = import.meta.env.VITE_URL_BACK

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`${URL}/paquetes/${id}`)
        if (!response.ok) throw new Error('Error al cargar datos')

        const data = await response.json()
        const tourEncontrado = data
        setTour(tourEncontrado)
      } catch (error) {
        console.log('Error', error)
      }
    }
    fetchTour()
  }, [URL, id])

  // prettier-ignore
  const pseudoGallery = tour
    ? [
      {
        imageId: 1,
        src: tour.imagenes[0]
      },
      {
        imageId: 2,
        src: 'https://images.unsplash.com/photo-1546863340-7e4e97e46f42?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWNvbmNhZ3VhfGVufDB8fDB8fHww'
      },
      {
        imageId: 3,
        src: 'https://images.unsplash.com/photo-1483631224226-a219224bb76e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWNvbmNhZ3VhfGVufDB8fDB8fHww'
      },
      {
        imageId: 4,
        src: 'https://images.unsplash.com/photo-1598313795136-a202370958af?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    ]
    : []

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-100">
      {tour ? (
        <>
          <div className="flex justify-between items-center h-[100px]">
            <h1>{tour.destino}</h1>
            <Link to="/">
              <span
                className="material-symbols-outlined text-2xl text-gray-500 transition-all duration-200 hover:text-gray-900 hover:text-3xl"
                width="100%">
                arrow_back_ios
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ga">
            {pseudoGallery.map(image => (
              <Image key={image.imageId} src={image.src} />
            ))}
            {/* <Image src={tour.imagenes[0]} alt={tour.destino} className="w-full h-80 object-cover rounded-lg my-4" /> */}
          </div>
          <p className="text-gray-700">{tour.descripcion}</p>
        </>
      ) : (
        <p className="text-center mt-10">Cargando...</p>
      )}
    </div>
  )
}

export default DetalleTour
