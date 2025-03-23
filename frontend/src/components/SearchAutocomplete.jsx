import { Listbox, ListboxItem } from '@heroui/react'

const SearchAutocomplete = ({ suggestions, onSelect, isOpen }) => {
  if (!isOpen || suggestions.length === 0) return null

  return (
    <div className="absolute w-full z-[100] mt-1">
      <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg overflow-hidden">
        {suggestions.map((suggestion, index) => (
          <div
            key={`${suggestion}-${index}`}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SearchAutocomplete 