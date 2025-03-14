import { Spinner } from '@heroui/react'
import { useSearch } from '@context/SearchContext'

import CardMain from '../../../components/ui/CardTour.jsx'

import './body.scss'

const Body = () => {
  const { searchResults, loading, searchTerm, advancedSearchParams } = useSearch()
  const { success, data = [] } = searchResults || {}

  const emptyPlaces = success && data.length === 0
  const isSearching = searchTerm.trim() !== '' || advancedSearchParams.dateRange?.startDate

  // Función para formatear las fechas
  const formatDate = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Determinar el título basado en el estado de búsqueda
  let title = 'Recomendaciones'
  let subtitle = ''

  if (isSearching) {
    // Construir título con término de búsqueda
    if (searchTerm.trim()) {
      title = `Resultados para "${searchTerm}"`
    } else {
      title = 'Resultados de búsqueda'
    }

    // Agregar información de fechas si están presentes
    if (advancedSearchParams.dateRange?.startDate) {
      const startFormatted = formatDate(advancedSearchParams.dateRange.startDate)

      if (advancedSearchParams.dateRange.endDate) {
        const endFormatted = formatDate(advancedSearchParams.dateRange.endDate)
        subtitle = `Fechas: ${startFormatted} - ${endFormatted}`
      } else {
        subtitle = `Fecha: ${startFormatted}`
      }
    }

    // Mensaje cuando no hay resultados
    if (emptyPlaces) {
      title = `No se encontraron resultados`
      if (searchTerm.trim()) {
        subtitle = `para "${searchTerm}"`
      }
    }
  } else if (emptyPlaces) {
    title = 'No hay tours disponibles...'
  }

  return (
    <div className="tours_body-container">
      <h1 className="title">{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}

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
