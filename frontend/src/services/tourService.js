import fetchData from '@utils/fetchData.js'

const URL = import.meta.env.VITE_URL_BACK

export const toursAllRandom = async filter => await fetchData(`${URL}/tours/random`)
