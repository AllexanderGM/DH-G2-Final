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
    // Add more advanced search params as needed
  })

  // Load initial tours data when component mounts
  const loadTours = useCallback(async () => {
    try {
      setLoading(true)

      console.log('Cargando data de tours iniciales... 🚀')

      const response = await toursAllRandom()

      setAllTours(response)
      setSearchResults(response)
      console.log('Initial tours loaded:', response)
    } catch (error) {
      console.error('Error al cargar tours', error)
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

  const updateAdvancedSearchParams = useCallback(params => {
    setAdvancedSearchParams(prev => ({
      ...prev,
      ...params
    }))
  }, [])

  const searchTours = useCallback(async () => {
    setLoading(true)
    console.log('Buscando tours cont term:', searchTerm)

    try {
      if (!allTours) {
        // Si no han sido cargados todavía, cargarlos primero
        await loadTours()
      }

      if (!searchTerm.trim()) {
        setSearchResults(allTours)
        return
      }

      // Perform client-side filtering
      // Nota: Esto se puede reemplazar con una llamada a la API cuando se implemente la búsqueda en el servidor
      const lowercaseSearchTerm = searchTerm.toLowerCase().trim()

      const filteredResults = {
        ...allTours,
        data: allTours.data.filter(tour => {
          return (
            tour.name?.toLowerCase().includes(lowercaseSearchTerm) ||
            tour.destination?.country?.toLowerCase().includes(lowercaseSearchTerm) ||
            tour.destination?.city?.toLowerCase().includes(lowercaseSearchTerm) ||
            tour.destination?.region?.toLowerCase().includes(lowercaseSearchTerm) ||
            tour.tags?.some(tag => tag.toLowerCase().includes(lowercaseSearchTerm))
          )
        })
      }

      console.log('Resultados de búsqueda:', filteredResults)
      setSearchResults(filteredResults)
    } catch (error) {
      console.error('Error al buscar tours', error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, allTours, loadTours])

  // Espera por cambios en searchTerm y ejecuta la función searchTours
  useEffect(() => {
    const delay = setTimeout(() => {
      searchTours()
    }, 300) // 300m debounce search

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
