import { Input, Button, Autocomplete, AutocompleteItem } from '@heroui/react'
import { useState } from 'react'
import { DateRangePicker } from '@heroui/date-picker'

import styles from '../styles/Hero.module.css'
import SearchIcon from './SearchIcon.jsx'
import image from '../assets/Backgrounds/topography.svg'

const NewHero = () => {
  const [searchValue, setSearchValue] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [suggestions, setSuggestions] = useState([]) // Para autocompletado

  // Simula el fetch de sugerencias al tipear - esto conectaría con tu backend
  const handleSearchInput = value => {
    setSearchValue(value)

    // Simulación de autocompletado - en producción esto sería un fetch al backend
    if (value.length > 2) {
      // Ejemplo: Simula búsqueda de lugares basado en el input
      const mockSuggestions = [
        { id: 1, label: `${value} en la playa` },
        { id: 2, label: `${value} en la montaña` },
        { id: 3, label: `${value} tours guiados` }
      ]
      setSuggestions(mockSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSearch = () => {
    // Implementa la lógica de búsqueda usando searchValue y dateRange
    console.log('Búsqueda:', searchValue, dateRange)
    // Aquí enviarías los datos al backend o actualizarías el estado
  }

  return (
    <div
      className={`flex flex-col justify-center items-center min-h-96 text-center mb-14 ${styles.container}`}
      style={{ backgroundImage: `url("${image}")` }}>
      <div className={`${styles.pattern_overlay}`}></div>

      {/* Título */}
      <h1 className={`text-4xl md:text-6xl font-bold tracking-tight p-4`}>
        <span className="inline-block">
          <span>🌎</span> La búsqueda perfecta,
        </span>
        <br />
        <span className="bg-gradient-to-r from-[#E86C6E] to-primary/70 text-transparent bg-clip-text">del tour perfecto</span>
      </h1>

      {/* Párrafo descriptivo */}
      <p className="text-lg text-gray-700 mb-6 max-w-2xl px-4">
        Encuentra experiencias únicas seleccionando destino y fechas para descubrir los mejores tours disponibles.
      </p>

      {/* Bloque de búsqueda completo */}
      <div className="w-full max-w-6xl px-4 md:px-10 lg:px-20 rounded-2xl">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Buscador con autocompletado */}
            <div className="col-span-1 md:col-span-3 lg:col-span-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">¿Dónde quieres ir?</label>
              <Autocomplete
                defaultItems={suggestions}
                inputValue={searchValue}
                onInputChange={handleSearchInput}
                className="w-full"
                radius="lg"
                startContent={<SearchIcon className="text-slate-500 pointer-events-none flex-shrink-0" />}
                placeholder="Buscar destinos..."
                classNames={{
                  inputWrapper: [
                    'shadow-sm',
                    'bg-white',
                    'hover:bg-gray-50',
                    'group-data-[focus=true]:bg-white',
                    'group-data-[focus=true]:border-1',
                    'group-data-[focus=true]:border-[#E86C6E]'
                  ]
                }}>
                {item => (
                  <AutocompleteItem key={item.id} value={item.label}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            {/* Selector de fechas */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">¿Cuándo viajas?</label>
              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDatesChange={({ startDate, endDate }) => setDateRange({ startDate, endDate })}
                focusedInput={null}
                numberOfMonths={2}
                minimumNights={0}
                isOutsideRange={() => false}
                displayFormat="DD/MM/YYYY"
                placeholder="Seleccionar fechas..."
                showClearDates
                noBorder
                block
                className="w-full"
              />
            </div>

            {/* Botón de búsqueda */}
            <div className="col-span-1 flex items-end">
              <Button
                color="primary"
                size="lg"
                radius="lg"
                className="w-full bg-gradient-to-r from-[#E86C6E] to-primary/90 text-white"
                onPress={handleSearch}>
                Buscar tours
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewHero
