import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DetalleTour = () => {
  const { id } = useParams()
  const [tour, setTour] = useState(null)

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch('/data/tours.json')
        if (!response.ok) throw new Error('Error al cargar datos')

        const data = await response.json()
        const tourEncontrado = data.find(item => item.id.toString() === id)
        setTour(tourEncontrado)
      } catch (error) {
        console.log('Error', error)
      }
    }
    fetchTour()
  }, [id])

  if (!tour) return <h1 className="text-center mt-10">Cargando...</h1>

  return (
    <div className="max-w-6xl mx-auto p-6 ">
      <h1>{tour.place}</h1>
      <img
        src={new URL(`../assets/Lugares/md/${tour.imageUrl}`, import.meta.url).href}
        alt={tour.place}
        className="w-full h-80 object-cover rounded-lg my-4"
      />
      <p className="text-gray-700">{tour.description}</p>
    </div>
  )
}

export default DetalleTour
