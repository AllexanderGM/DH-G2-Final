import { useState, useEffect } from 'react'
import { Button, Popover, PopoverTrigger, PopoverContent } from '@heroui/react'
import { useSearch } from '@context/SearchContext'
import { CalendarIcon } from '@utils/icons'

const DateRangePicker = () => {
  const { advancedSearchParams, updateAdvancedSearchParams } = useSearch()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null
  })

  // Sync with context values
  useEffect(() => {
    if (advancedSearchParams.dateRange) {
      setSelectedRange(advancedSearchParams.dateRange)
    }
  }, [advancedSearchParams.dateRange])

  // Format dates for display
  const formatDate = date => {
    if (!date) return ''
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  // Get display text
  const getDisplayText = () => {
    if (selectedRange.startDate && selectedRange.endDate) {
      return `${formatDate(selectedRange.startDate)} - ${formatDate(selectedRange.endDate)}`
    }
    return 'mm/dd/yyyy - mm/dd/yyyy'
  }

  // Handle date selection
  const handleDateChange = (startDate, endDate) => {
    const newRange = { startDate, endDate }
    setSelectedRange(newRange)
    updateAdvancedSearchParams({ dateRange: newRange })
  }

  // Handle calendar opening/closing
  const handleOpenChange = open => {
    setIsOpen(open)
  }

  // Clear date selection
  const handleClear = () => {
    setSelectedRange({ startDate: null, endDate: null })
    updateAdvancedSearchParams({ dateRange: null })
  }

  return (
    <Popover isOpen={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button
          variant="flat"
          className="w-full h-12 justify-start px-4 text-left text-default-500"
          startContent={<CalendarIcon className="text-default-500" />}>
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          <div className="flex flex-col gap-4">
            {/* This would be replaced with an actual calendar component */}
            <p className="text-sm text-default-500">
              Nota: Esta es una implementación de marcador de posición. Integra aquí un componente de calendario real.
            </p>
            <div className="flex gap-2">
              <Button
                color="primary"
                className="flex-1"
                onClick={() => {
                  // Sample dates for demonstration
                  const today = new Date()
                  const nextWeek = new Date()
                  nextWeek.setDate(today.getDate() + 7)
                  handleDateChange(today, nextWeek)
                }}>
                Aplicar
              </Button>
              <Button color="default" variant="flat" onClick={handleClear}>
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateRangePicker
