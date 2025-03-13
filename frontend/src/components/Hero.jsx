import { Input, Button } from '@heroui/react'
import { useState, useEffect } from 'react'
import { useSearch } from '@context/SearchContext'
import './hero.scss'
import SearchIcon from '@components/SearchIcon.jsx'
import image from '@assets/Backgrounds/topography.svg'

import DateRangePicker from './DateRangePicker.jsx'

const Hero = () => {
  const { searchTerm, updateSearchTerm, loading, searchTours } = useSearch()
  const [inputValue, setInputValue] = useState(searchTerm)
  const [expanded, setExpanded] = useState(false)

  // Sync inputValue with searchTerm from context
  useEffect(() => {
    setInputValue(searchTerm)
  }, [searchTerm])

  // Handle input changes with debounce
  const handleInputChange = e => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Update the search context
    updateSearchTerm(newValue)
  }

  // Handle clear input
  const handleClear = () => {
    setInputValue('')
    updateSearchTerm('')
  }

  // Handle search button click
  const handleSearch = () => {
    searchTours()
  }

  // Toggle advanced search
  const toggleAdvancedSearch = () => {
    setExpanded(!expanded)
  }

  return (
    <div
      className="flex flex-col justify-center items-center h-auto py-12 text-center mb-14 hero_container"
      style={{ backgroundImage: `url("${image}")` }}>
      <div className="pattern_overlay"></div>
      <h1 className={`text-4xl md:text-6xl font-bold tracking-tight p-6 `}>
        <span className="inline-block">
          <span>🌎</span> La búsqueda perfecta,
        </span>
        <br />
        <span className="bg-gradient-to-r from-[#E86C6E] to-primary/70 text-transparent bg-clip-text">del tour perfecto</span>
      </h1>
      <p className="text-center max-w-2xl mb-6 text-slate-700">
        Encuentra experiencias únicas seleccionando destino y fechas para descubrir los mejores tours disponibles.
      </p>

      <div className="w-full max-w-6xl px-[50px] md:px-[150px] rounded-2xl">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
            {/* Destino input */}
            <div className="md:col-span-5">
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">¿Dónde quieres ir?</label>
              <Input
                isClearable
                value={inputValue}
                onChange={handleInputChange}
                onClear={handleClear}
                isDisabled={loading}
                classNames={{
                  input: ['bg-transparent', 'text-black/90', 'placeholder:text-default-900/50'],
                  innerWrapper: 'bg-transparent',
                  inputWrapper: [
                    'bg-default-100',
                    'hover:bg-default-200',
                    'group-data-[focus=true]:bg-default-100',
                    '!cursor-text',
                    'group-data-[focus=true]:border-1',
                    'group-data-[focus=true]:border-[#E86C6E]'
                  ]
                }}
                placeholder="Buscar destinos..."
                radius="lg"
                startContent={<SearchIcon className="text-black/50 mb-0.5 text-slate-500 pointer-events-none flex-shrink-0" />}
              />
            </div>

            {/* Date picker - only show if expanded */}
            {expanded && (
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 text-left mb-1">¿Cuándo viajas?</label>
                <DateRangePicker />
              </div>
            )}

            {/* Search button */}
            <div className={`${expanded ? 'md:col-span-8' : 'md:col-span-3'} flex items-end`}>
              <div className="flex w-full gap-2">
                <Button
                  color="primary"
                  className="w-full h-12 bg-gradient-to-r from-[#E86C6E] to-primary hover:opacity-90"
                  onClick={handleSearch}
                  isDisabled={loading}>
                  Buscar tours
                </Button>
                <Button variant="flat" color="default" className="h-12" onClick={toggleAdvancedSearch}>
                  {expanded ? 'Simple' : 'Avanzado'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
