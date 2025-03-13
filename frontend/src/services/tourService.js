import fetchData from '@utils/fetchData.js'

const URL = import.meta.env.VITE_URL_BACK

/**
 * @param {Object} filter - Optional filter parameters
 * @returns {Promise} - Promise with tours data
 */
export const toursAllRandom = async filter => {
  console.log('Fetching random tours con filter:', filter)
  // Esta implementación devuelve todos los tours
  // Esto puede ser expandido más tarde para soportar filtrado del lado del servidor
  return await fetchData(`${URL}/tours/random`)
}

/**
 * Búsqueda de tours con criterios específicos
 * Nota: este es un placeholder para una implementación futura en el servidor
 * @param {string} searchTerm - Text to search for
 * @param {Object} advancedParams - Additional search parameters like dates, price range, etc.
 * @returns {Promise} - Promise with filtered tours data
 */
export const searchTours = async (searchTerm, advancedParams = {}) => {
  console.log('Buscando tours con el término:', searchTerm)

  // Por ahora haremos un filtrado client-side implementado en SearchContext
  // Más tarde, esto se puede reemplazar con una llamada a la API cuando se implemente la búsqueda en el servidor
  // return await fetchData(`${URL}/tours/search?term=${encodeURIComponent(searchTerm)}...`)

  return await toursAllRandom()
}

/**
 * Get tour by ID
 * @param {string|number} id - Tour ID
 * @returns {Promise} - Promise with tour data
 */
export const getTourById = async id => {
  return await fetchData(`${URL}/tours/${id}`)
}
