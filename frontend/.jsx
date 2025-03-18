import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toursAllRandom } from '@services/tourService.js'

// Create the search context
const SearchContext = createContext()

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

// Provider component
export const SearchProvider = ({ children }) => {
  // State for search term and results
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allTours, setAllTours] = useState(null)
  const [toursAvailability, setToursAvailability] = useState({})
  const [advancedSearchParams, setAdvancedSearchParams] = useState({
    dateRange: null
  })

  // Load initial tours data when component mounts
  const loadTours = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Loading initial tours data...')
      const response = await toursAllRandom()
      setAllTours(response)
      setSearchResults(response)
      console.log('Initial tours loaded:', response)

      // After loading tours, fetch availability for each tour
      if (response?.data?.length > 0) {
        await loadAvailabilityData(response.data)
      }
    } catch (error) {
      console.error('Error loading tours:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // For debugging - log when advancedSearchParams changes
  useEffect(() => {
    console.log('Advanced search params updated:', advancedSearchParams)
  }, [advancedSearchParams])

  // Function to load availability data for tours
  const loadAvailabilityData = useCallback(async tours => {
    try {
      const availabilityData = {}

      // Fetch availability data for each tour
      for (const tour of tours) {
        try {
          const response = await fetch(`http://localhost:8080/availability/tour/${tour.id}`)
          if (response.ok) {
            const data = await response.json()
            availabilityData[tour.id] = data
          } else {
            console.warn(`No availability data for tour ${tour.id}`)
            availabilityData[tour.id] = []
          }
        } catch (err) {
          console.error(`Error fetching availability for tour ${tour.id}:`, err)
          availabilityData[tour.id] = []
        }
      }

      setToursAvailability(availabilityData)
      console.log('Availability data loaded:', availabilityData)
    } catch (error) {
      console.error('Error loading availability data:', error)
    }
  }, [])

  // Use effect to load tours on mount
  useEffect(() => {
    loadTours()
  }, [loadTours])

  // Function to update search term
  const updateSearchTerm = useCallback(term => {
    setSearchTerm(term)
  }, [])

  // Function to update advanced search params
  const updateAdvancedSearchParams = useCallback(params => {
    setAdvancedSearchParams(prev => ({
      ...prev,
      ...params
    }))
  }, [])

  // Helper function to check if a tour is available within a date range
  const isTourAvailableInDateRange = useCallback(
    (tourId, startDate, endDate) => {
      // If no date range is specified, the tour is considered available
      if (!startDate || !endDate) return true

      // Convert start and end dates to timestamps for comparison
      const start = new Date(startDate).getTime()
      const end = new Date(endDate).getTime()

      // Get availability dates for this tour
      const availabilities = toursAvailability[tourId] || []

      // Check if at least one availability date falls within the specified range
      return availabilities.some(availability => {
        const availDate = new Date(availability.availableDate).getTime()
        return availDate >= start && availDate <= end && availability.availableSlots > 0
      })
    },
    [toursAvailability]
  )

  // Function to perform search
  const searchTours = useCallback(async () => {
    setLoading(true)
    console.log('Searching tours with term:', searchTerm)
    console.log('Advanced search params:', advancedSearchParams)

    try {
      if (!allTours) {
        // If no tours are loaded yet, load them first
        await loadTours()
      }

      // Get search term and date range
      const lowercaseSearchTerm = searchTerm.toLowerCase().trim()
      const { dateRange } = advancedSearchParams

      // Apply filters
      const filteredResults = {
        ...allTours,
        data: allTours.data.filter(tour => {
          // Text search filter
          const matchesSearchTerm =
            !lowercaseSearchTerm ||
            tour.name?.toLowerCase().includes(lowercaseSearchTerm) ||
            tour.description?.toLowerCase().includes(lowercaseSearchTerm) ||
            tour.destination?.country?.toLowerCase().includes(lowercaseSearchTerm) ||
            tour.destination?.city?.name?.toLowerCase().includes(lowercaseSearchTerm) ||
            tour.destination?.region?.toLowerCase().includes(lowercaseSearchTerm) ||
            (tour.tags && tour.tags.some(tag => tag.toLowerCase().includes(lowercaseSearchTerm)))

          // Date range filter
          const isAvailableInDateRange = !dateRange || isTourAvailableInDateRange(tour.id, dateRange.startDate, dateRange.endDate)

          // A tour must match both filters to be included
          return matchesSearchTerm && isAvailableInDateRange
        })
      }

      console.log('Search results:', filteredResults)
      setSearchResults(filteredResults)
    } catch (error) {
      console.error('Error searching tours:', error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, advancedSearchParams, allTours, loadTours, isTourAvailableInDateRange])

  // Watch for changes in search term or advanced params and trigger search
  useEffect(() => {
    const delay = setTimeout(() => {
      searchTours()
    }, 300) // Debounce search for 300ms

    return () => clearTimeout(delay)
  }, [searchTerm, advancedSearchParams, searchTours])

  // The context value to be provided
  const value = {
    searchTerm,
    searchResults,
    loading,
    advancedSearchParams,
    toursAvailability,
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
