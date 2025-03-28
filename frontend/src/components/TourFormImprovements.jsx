import { useEffect, useState } from 'react'

// Constantes extraídas del DataInitializer.java
const PREDEFINED_HOTELS = [
  { id: 1, name: 'Grand Oasis Cancun', stars: 5 },
  { id: 2, name: 'Hotel Caribe', stars: 4 },
  { id: 3, name: 'Ritz Paris', stars: 5 },
  { id: 4, name: 'Hotel Hassler Roma', stars: 5 },
  { id: 5, name: 'Four Seasons Bali', stars: 5 },
  { id: 6, name: 'Plaza Hotel NYC', stars: 5 },
  { id: 7, name: 'Belmond Sanctuary', stars: 5 },
  { id: 8, name: 'Copacabana Palace', stars: 5 },
  { id: 9, name: 'Burj Al Arab', stars: 7 },
  { id: 10, name: 'W Barcelona', stars: 5 }
]

// Mejoras para los formularios
export const TourFormImprovements = ({ formData, handleInputChange, includesDetails, setIncludesDetails }) => {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [filteredCities, setFilteredCities] = useState([])

  useEffect(() => {
    // Cargar países y ciudades desde countries.json
    const loadLocationData = async () => {
      try {
        const response = await window.fs.readFile('countries.json', { encoding: 'utf8' })
        const data = JSON.parse(response)
        const countryList = Object.entries(data).map(([code, country]) => ({
          code,
          name: country.name,
          region: country.region
        }))
        setCountries(countryList)
      } catch (error) {
        console.error('Error loading countries:', error)
      }
    }

    loadLocationData()
  }, [])

  // Filtrar ciudades cuando cambia el país seleccionado
  const handleCountryChange = countryCode => {
    handleInputChange('destination.country', countryCode)

    // Restablecer ciudad seleccionada
    handleInputChange('destination.city', '')

    // Filtrar ciudades del país seleccionado
    const selectedCountry = countries.find(c => c.code === countryCode)
    if (selectedCountry) {
      const citiesForCountry = cities.filter(city => city.countryCode === countryCode)
      setFilteredCities(citiesForCountry)
    } else {
      setFilteredCities([])
    }
  }

  return (
    <>
      {/* Selector de País y Ciudad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">País</label>
          <select
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E86C6E] focus:border-[#E86C6E]"
            value={formData.destination.country}
            onChange={e => handleCountryChange(e.target.value)}
            required>
            <option value="">Seleccione un país</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Ciudad</label>
          <select
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E86C6E] focus:border-[#E86C6E]"
            value={formData.destination.city}
            onChange={e => handleInputChange('destination.city', e.target.value)}
            required
            disabled={!formData.destination.country}>
            <option value="">Seleccione una ciudad</option>
            {filteredCities.map(city => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selector de Hotel */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700">Hotel</label>
        <select
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E86C6E] focus:border-[#E86C6E]"
          value={formData.hotel}
          onChange={e => handleInputChange('hotel', parseInt(e.target.value))}
          required>
          <option value="">Seleccione un hotel</option>
          {PREDEFINED_HOTELS.map(hotel => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name} ({hotel.stars} ⭐)
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
