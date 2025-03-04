import { useEffect, useState, useCallback } from 'react'

import CardMain from './CardMain.jsx'
import Categories from './Categories.jsx'

const BodyComponent = () => {
  const [lugares, setLugares] = useState([])
  const URL = import.meta.env.VITE_URL_BACK

  const fetchLugares = useCallback(async () => {
    try {
      const response = await fetch(`${URL}/paquetes/aleatorios`)
      if (!response.ok) {
        throw new Error('Error al cargar los datos')
      }
      const data = await response.json()
      setLugares(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [URL])

  useEffect(() => {
    fetchLugares()
  }, [fetchLugares])

  const Recomendaciones = lugares.slice(0, 9)

  // // Función para filtrar lugares por categoría
  // const getLugaresPorCategoria = categoria => lugares.filter(lugar => lugar.placeType === categoria)

  return (
    <div className="flex flex-col items-center 9-full min-h-screen bg-gray-100 p-6 mb-6">
      <Categories />
      <h1 className="text-base text-gray-600 mb-6">Recomendaciones</h1>

      <div className="w-full max-w-6xl mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {Recomendaciones.map(lugar => (
            <CardMain key={lugar.idPaquete} data={lugar} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BodyComponent
