/**
 * Utility functions for checking tour availability
 */

/**
 * Fetches availability data for a specific tour
 * @param {number|string} tourId - The ID of the tour
 * @returns {Promise<Array>} - Array of availability objects for the tour
 */
export const fetchTourAvailability = async tourId => {
  try {
    const response = await fetch(`http://localhost:8080/availability/tour/${tourId}`)
    if (!response.ok) {
      console.warn(`Could not fetch availability for tour ${tourId}`)
      return []
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching availability for tour ${tourId}:`, error)
    return []
  }
}

/**
 * Checks if a tour is available within a specified date range
 * @param {Array} availabilities - Array of availability objects for the tour
 * @param {string|Date} startDate - Start date of the range
 * @param {string|Date} endDate - End date of the range
 * @returns {boolean} - True if the tour is available in the range, false otherwise
 */
export const isTourAvailableInRange = (availabilities, startDate, endDate) => {
  // If no date range is provided, consider the tour available
  if (!startDate || !endDate) return true

  // If no availabilities provided, consider the tour unavailable
  if (!availabilities || !Array.isArray(availabilities) || availabilities.length === 0) {
    return false
  }

  // Convert dates to timestamps for easier comparison
  const startTimestamp = new Date(startDate).getTime()
  const endTimestamp = new Date(endDate).getTime()

  // Check if at least one availability date falls within the range
  return availabilities.some(avail => {
    const availDate = new Date(avail.availableDate).getTime()
    return availDate >= startTimestamp && availDate <= endTimestamp && avail.availableSlots > 0
  })
}

/**
 * Gets all available dates for a tour
 * @param {Array} availabilities - Array of availability objects for the tour
 * @returns {Array} - Array of Date objects representing available dates
 */
export const getAvailableDates = availabilities => {
  if (!availabilities || !Array.isArray(availabilities)) {
    return []
  }

  return availabilities.filter(avail => avail.availableSlots > 0).map(avail => new Date(avail.availableDate))
}
