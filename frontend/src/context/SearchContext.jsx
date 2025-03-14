import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toursAllRandom } from '@services/tourService.js'

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allTours, setAllTours] = useState(null)
  const [advancedSearchParams, setAdvancedSearchParams] = useState({
    dateRange: null
  })

  const loadTours = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Loading initial tours data...')
      const response = await toursAllRandom()
      console.log('Initial tours response:', response)

      setAllTours(response)
      setSearchResults(response)
    } catch (error) {
      console.error('Error loading tours:', error)
      setSearchResults({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTours()

    // Escuchar el evento de reset para DateRangePicker
    const handleResetEvent = () => {
      setAdvancedSearchParams({
        dateRange: null
      })
    }

    window.addEventListener('reset-date-range', handleResetEvent)

    return () => {
      window.removeEventListener('reset-date-range', handleResetEvent)
    }
  }, [loadTours])

  const updateSearchTerm = useCallback(term => {
    setSearchTerm(term)
  }, [])

  // Función para actualizar los parámetros de búsqueda avanzada
  const updateAdvancedSearchParams = useCallback(params => {
    setAdvancedSearchParams(prev => ({
      ...prev,
      ...params
    }))
  }, [])

  const searchTours = useCallback(async () => {
    setLoading(true)
    console.log('Searching tours with term:', searchTerm)
    console.log('Advanced search params:', advancedSearchParams)

    try {
      if (!allTours) {
        await loadTours()
        return
      }

      if (!searchTerm.trim() && !advancedSearchParams.dateRange?.startDate) {
        setSearchResults(allTours)
        setLoading(false)
        return
      }

      if (!allTours.data || !Array.isArray(allTours.data)) {
        console.error('Unexpected data structure:', allTours)
        setSearchResults({ success: false, error: 'Formato de datos inesperado' })
        setLoading(false)
        return
      }

      let filteredResults = [...allTours.data]

      // Filtrar por término de búsqueda
      if (searchTerm.trim()) {
        const lowercaseSearchTerm = searchTerm.toLowerCase().trim()

        filteredResults = filteredResults.filter(tour => {
          return (
            // Campos básicos
            (tour.name && tour.name.toLowerCase().includes(lowercaseSearchTerm)) ||
            (tour.description && tour.description.toLowerCase().includes(lowercaseSearchTerm)) ||
            // Campos de destino
            (tour.destination?.country && tour.destination.country.toLowerCase().includes(lowercaseSearchTerm)) ||
            (tour.destination?.region && tour.destination.region.toLowerCase().includes(lowercaseSearchTerm)) ||
            (tour.destination?.city?.name && tour.destination.city.name.toLowerCase().includes(lowercaseSearchTerm)) ||
            // Tags
            (Array.isArray(tour.tags) && tour.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(lowercaseSearchTerm)))
          )
        })
      }

      // Filtrar por rango de fechas
      if (advancedSearchParams.dateRange?.startDate) {
        const startDate = new Date(advancedSearchParams.dateRange.startDate)
        const endDate = advancedSearchParams.dateRange.endDate ? new Date(advancedSearchParams.dateRange.endDate) : null

        // Aquí añadiríamos la lógica para filtrar por fechas
        // Por ahora es un placeholder hasta que tengamos información de fechas en los tours
        console.log('Filtering by date range:', startDate, endDate)

        // Cuando tengamos datos de fechas de tours, podríamos hacer algo como:
        /*
        filteredResults = filteredResults.filter(tour => {
          const tourStartDate = new Date(tour.startDate)
          return tourStartDate >= startDate && (!endDate || tourStartDate <= endDate)
        })
        */
      }

      console.log('Filtered results count:', filteredResults.length)

      setSearchResults({
        ...allTours,
        data: filteredResults
      })
    } catch (error) {
      console.error('Error searching tours:', error)
      setSearchResults({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }, [searchTerm, advancedSearchParams, allTours, loadTours])

  // Ejecutar la búsqueda cuando cambian los parámetros
  useEffect(() => {
    const delay = setTimeout(() => {
      searchTours()
    }, 300) // Debounce search por 300ms

    return () => clearTimeout(delay)
  }, [searchTerm, advancedSearchParams.dateRange, searchTours])

  const value = {
    searchTerm,
    searchResults,
    loading,
    advancedSearchParams,
    updateSearchTerm,
    updateAdvancedSearchParams,
    searchTours,
    loadTours
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default SearchContext
