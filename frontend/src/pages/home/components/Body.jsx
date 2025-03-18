import { Spinner } from '@heroui/react'
import { useSearch } from '@context/SearchContext'
import { useEffect } from 'react'
import { getTourAvailabilities } from '@services/availabilityService.js'

import CardMain from '../../../components/ui/CardTour.jsx'

import './body.scss'

const Body = () => {
  const { searchResults, loading, searchTerm } = useSearch()
  const { success, data = [] } = searchResults || {}

  const emptyPlaces = success && data.length === 0
  const isSearching = searchTerm.trim() !== ''

  // Determinar el título basado en el estado de búsqueda
  let title = 'Recomendaciones'
  if (isSearching) {
    title = `Resultados para "${searchTerm}"`
    if (emptyPlaces) {
      title = `No se encontraron resultados para "${searchTerm}"`
    }
  } else if (emptyPlaces) {
    title = 'No hay tours disponibles...'
  }

  return (
    <div className="tours_body-container">
      <h1 className="title">{title}</h1>

      <div className="tours_body-content">
        {loading ? (
          <div className="grid content-center gap-8">
            <Spinner classNames={{ label: 'text-foreground mt-4' }} label="Cargando" variant="wave" />
          </div>
        ) : success ? (
          <div className="tours_body-grid">
            {data.slice(0, 9).map(place => (
              <CardMain key={place.id} data={place} />
            ))}
          </div>
        ) : (
          <div className="grid content-center gap-8">
            <p className="text-center text-gray-500">Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Body
