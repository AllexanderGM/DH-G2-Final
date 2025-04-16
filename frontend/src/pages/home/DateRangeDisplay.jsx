import { useSearch } from '@context/SearchContext'

const DateRangeDisplay = () => {
  const { advancedSearchParams, searchResults } = useSearch()

  console.log('DateRangeDisplay - Estado actual:', advancedSearchParams)

  const hasStartDate =
    advancedSearchParams.dateRange?.start?.day &&
    advancedSearchParams.dateRange?.start?.month &&
    advancedSearchParams.dateRange?.start?.year

  const hasEndDate =
    advancedSearchParams.dateRange?.end?.day && advancedSearchParams.dateRange?.end?.month && advancedSearchParams.dateRange?.end?.year

  const formatDate = dateObj => {
    if (!dateObj) return 'No especificada'

    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ]

    return `${dateObj.day} de ${months[dateObj.month - 1]} de ${dateObj.year}`
  }

  // Crear objetos Date para el rango seleccionado (si existe)
  let selectedStartDate = null
  let selectedEndDate = null

  if (hasStartDate) {
    const { year, month, day } = advancedSearchParams.dateRange.start
    selectedStartDate = new Date(year, month - 1, day) // month es 0-indexed en JS Date
  }

  if (hasEndDate) {
    const { year, month, day } = advancedSearchParams.dateRange.end
    selectedEndDate = new Date(year, month - 1, day)
  }

  // Extraer fechas de los tours
  const tourDates = []
  if (searchResults && searchResults.data && Array.isArray(searchResults.data)) {
    searchResults.data.forEach(tour => {
      if (tour.availability && Array.isArray(tour.availability)) {
        tour.availability.forEach(avail => {
          if (avail.departureTime) {
            try {
              const departureDate = new Date(avail.departureTime)

              // Verificar si está en el rango seleccionado
              let isInSelectedRange = false
              if (selectedStartDate && selectedEndDate) {
                isInSelectedRange = departureDate >= selectedStartDate && departureDate <= selectedEndDate
              }

              tourDates.push({
                tourId: tour.id,
                tourName: tour.name,
                departureDate: departureDate,
                formattedDate: departureDate.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }),
                isInSelectedRange
              })
            } catch (e) {
              console.error('Error al procesar fecha de tour:', e)
            }
          }
        })
      }
    })
  }

  // Ordenar las fechas
  tourDates.sort((a, b) => a.departureDate - b.departureDate)

  if (!hasStartDate) {
    return (
      <div className="text-center mt-2 mb-6 text-gray-500">
        <p>No hay fechas seleccionadas</p>

        {tourDates.length > 0 && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md mx-auto max-w-md">
            <p className="font-medium mb-2">Fechas de salida disponibles:</p>
            <div className="flex flex-col gap-1 text-sm">
              {tourDates.slice(0, 5).map((tour, index) => (
                <p key={index} className="text-gray-700">
                  <span className="font-medium">{tour.tourName}:</span> {tour.formattedDate}
                </p>
              ))}
              {tourDates.length > 5 && <p className="text-gray-500 italic">Y {tourDates.length - 5} fechas más...</p>}
            </div>
          </div>
        )}
      </div>
    )
  }

  const startDateStr = formatDate(advancedSearchParams.dateRange.start)
  const endDateStr = formatDate(advancedSearchParams.dateRange.end)

  return (
    <div className="text-center mt-2 mb-6">
      <div className="p-3 bg-gray-100 rounded-md mx-auto max-w-md mb-4">
        <p className="font-medium">Fechas seleccionadas:</p>
        <p>
          Desde: <span className="text-primary font-semibold">{startDateStr}</span>
        </p>
        {hasEndDate && (
          <p>
            Hasta: <span className="text-primary font-semibold">{endDateStr}</span>
          </p>
        )}
      </div>

      {tourDates.length > 0 && (
        <div className="p-3 bg-gray-100 rounded-md mx-auto max-w-md">
          <p className="font-medium mb-2">Fechas de salida disponibles:</p>
          <div className="flex flex-col gap-1 text-sm">
            {tourDates.slice(0, 5).map((tour, index) => (
              <p key={index} className="text-gray-700">
                <span className="font-medium">{tour.tourName}:</span> {tour.formattedDate}
                <span
                  className="ml-2 px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: tour.isInSelectedRange ? '#e0f2e0' : '#f2e0e0',
                    color: tour.isInSelectedRange ? '#2e7d32' : '#c62828'
                  }}>
                  {tour.isInSelectedRange ? 'true' : 'false'}
                </span>
              </p>
            ))}
            {tourDates.length > 5 && <p className="text-gray-500 italic">Y {tourDates.length - 5} fechas más...</p>}
          </div>
        </div>
      )}

      <div className="p-3 bg-gray-100 rounded-md mx-auto max-w-md mt-4">
        <p className="font-medium mb-2">¿Tours dentro del rango seleccionado?</p>
        <div className="text-left">
          {tourDates.length === 0 ? (
            <p>No hay tours disponibles para analizar</p>
          ) : (
            tourDates.slice(0, 5).map((tour, index) => (
              <div key={index} className="py-1">
                <span className="font-medium">{tour.tourName}:</span>{' '}
                <span className={tour.isInSelectedRange ? 'text-green-600 font-medium' : 'text-red-600'}>
                  {tour.isInSelectedRange ? 'true' : 'false'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DateRangeDisplay
