import { getAuthToken } from '@services/authService.js'

export const getTourAvailabilities = async tourId => {
  try {
    const token = getAuthToken()
    const endpoint = `http://localhost:8080/api/availabilities/tour/${tourId}`
    console.log(`Consultando endpoint: ${endpoint}`)

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      }
    })

    // Log the raw response before parsing
    const rawText = await response.text()
    console.log('Raw response:', rawText)

    if (!response.ok) {
      console.error(`Error ${response.status} obteniendo disponibilidades para tour ${tourId}`)
      return []
    }

    // Check if response is actually JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', rawText)
      return []
    }

    return JSON.parse(rawText)
  } catch (error) {
    console.error(`Error consultando disponibilidades para tour ${tourId}:`, error)
    return []
  }
}
