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
    <div>
      <h1>{tour.place}</h1>
      <p>{tour.description}</p>
    </div>
  )
}

export default DetalleTour
