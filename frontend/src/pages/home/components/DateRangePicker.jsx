import { useState } from 'react'
import { DateRangePicker as HeroDateRangePicker } from '@heroui/react'
import { useSearch } from '@context/SearchContext'

const DateRangePicker = () => {
  const { advancedSearchParams, updateAdvancedSearchParams } = useSearch()
  const [dateRange, setDateRange] = useState(
    advancedSearchParams.dateRange || {
      startDate: null,
      endDate: null
    }
  )

  const handleDateChange = range => {
    setDateRange(range)
    updateAdvancedSearchParams({ dateRange: range })
  }

  // Obtener la fecha actual y añadir un año
  const today = new Date()
  const maxDate = new Date(today)
  maxDate.setFullYear(today.getFullYear() + 1)

  return (
    <HeroDateRangePicker
      startDate={dateRange.startDate}
      endDate={dateRange.endDate}
      onChange={handleDateChange}
      minDate={today}
      maxDate={maxDate}
      placeholder="mm/dd/yyyy - mm/dd/yyyy"
      size="lg"
      classNames={{
        trigger: [
          'bg-default-100',
          'hover:bg-default-200',
          'data-[focused=true]:bg-default-100',
          'data-[focused=true]:border-1',
          'data-[focused=true]:border-[#E86C6E]',
          'h-12'
        ]
      }}
    />
  )
}

export default DateRangePicker
