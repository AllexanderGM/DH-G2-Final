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
    // Agregar más parámetros de búsqueda avanzado según sea necesario
    // Por ejemplo, filtrar por categorías, precios, etc.
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
  }, [loadTours])

  const updateSearchTerm = useCallback(term => {
    setSearchTerm(term)
  }, [])

  // Función para actualizar los parámetros de búsqueda avanzado
  const updateAdvancedSearchParams = useCallback(params => {
    setAdvancedSearchParams(prev => ({
      ...prev,
      ...params
    }))
  }, [])

  const searchTours = useCallback(async () => {
    setLoading(true)
    console.log('Searching tours with term:', searchTerm)

    try {
      if (!allTours) {
        await loadTours()
        return
      }

      if (!searchTerm.trim()) {
        setSearchResults(allTours)
        setLoading(false)
        return
      }

      const lowercaseSearchTerm = searchTerm.toLowerCase().trim()

      if (!allTours.data || !Array.isArray(allTours.data)) {
        console.error('Unexpected data structure:', allTours)
        setSearchResults({ success: false, error: 'Formato de datos inesperado' })
        setLoading(false)
        return
      }

      const filteredResults = {
        ...allTours,
        data: allTours.data.filter(tour => {
          console.log('Filtering tour:', tour.name)

          return (
            // Campos básicos
            (tour.name && tour.name.toLowerCase().includes(lowercaseSearchTerm)) ||
            (tour.description && tour.description.toLowerCase().includes(lowercaseSearchTerm)) ||
            // Campos de destino
            (tour.destination?.country && tour.destination.country.toLowerCase().includes(lowercaseSearchTerm)) ||
            (tour.destination?.region && tour.destination.region.toLowerCase().includes(lowercaseSearchTerm)) ||
            (tour.destination?.city?.name && tour.destination.city.name.toLowerCase().includes(lowercaseSearchTerm)) ||
            // Tags (comprobando que sea un array y sus elementos sean strings)
            (Array.isArray(tour.tags) && tour.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(lowercaseSearchTerm)))
          )
        })
      }

      console.log('Filtered results:', filteredResults)
      setSearchResults(filteredResults)
    } catch (error) {
      console.error('Error searching tours:', error)
      setSearchResults({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }, [searchTerm, allTours, loadTours])

  // Esperando por cambios en searchTerm y ejecutar la función searchTours
  useEffect(() => {
    const delay = setTimeout(() => {
      searchTours()
    }, 300) // Debounce search por 300ms

    return () => clearTimeout(delay)
  }, [searchTerm, searchTours])

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
