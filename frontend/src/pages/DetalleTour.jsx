import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
  }, [id])

  if (!tour) return <h1 className="text-center mt-10">Cargando...</h1>

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gray-100">
      <h1>{tour.destino}</h1>
      <img src={tour.imagenes[0]} alt={tour.destino} className="w-full h-80 object-cover rounded-lg my-4" />
      <p className="text-gray-700">{tour.descripcion}</p>
    </div>
  )
}

export default DetalleTour
