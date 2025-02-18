import { useEffect, useState } from 'react'

import CardModel from './CardModel.jsx'
import Categories from './Categories.jsx'

const Body = () => {
  const [lugares, setLugares] = useState([])

  const fetchLugares = async () => {
    try {
      const response = await fetch('/data/tours.json')
      if (!response.ok) {
        throw new Error('Error al cargar los datos')
      }
      const data = await response.json()
      setLugares(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchLugares()
  }, [])

  const lugaresDestacados = lugares.slice(0, 4)

  // // Función para filtrar lugares por categoría
  // const getLugaresPorCategoria = categoria => lugares.filter(lugar => lugar.placeType === categoria)

  return (
    <div className="flex flex-col items-center 9-full min-h-screen bg-gray-100 p-6">
      <Categories />
      <h1 className="text-base text-gray-600 mb-6">Lugares Destacados</h1>

      <div className="w-full max-w-6xl mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-7">
          {lugaresDestacados.map(lugar => (
            <CardModel key={lugar.id} data={lugar} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Body
