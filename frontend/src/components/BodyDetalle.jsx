import { Card, CardBody, CardHeader, CardFooter, Chip } from '@heroui/react'

import CardDetalle from './CardDetalle.jsx'

const BodyDetalle = ({ tour }) => {
  // Verificar si tour tiene datos de servicios incluidos
  const hasIncludes = tour && tour.includes && Array.isArray(tour.includes) && tour.includes.length > 0

  // Mapa de iconos estáticos para usar de fallback o respaldo
  const incluye = [
    { icon: 'villa', tag: 'Alojamiento' },
    { icon: 'directions_bus', tag: 'Transporte' },
    { icon: 'confirmation_number', tag: 'Boletos' },
    { icon: 'icecream', tag: 'Snack' },
    { icon: 'water_full', tag: 'Bebidas' },
    { icon: 'breakfast_dining', tag: 'Desayuno' },
    { icon: 'ramen_dining', tag: 'Almuerzo' },
    { icon: 'restaurant', tag: 'Cena' },
    { icon: 'familiar_face_and_zone', tag: 'Guía' },
    { icon: 'local_hospital', tag: 'Seguro de vida' },
    { icon: 'downhill_skiing', tag: 'Actividades' },
    { icon: 'photo_camera', tag: 'Fotografías' },
    { icon: 'redeem', tag: 'Souvenirs' },
    { icon: 'roller_skating', tag: 'Equipamiento' },
    { icon: 'rss_feed', tag: 'Wifi' },
    { icon: 'savings', tag: 'Propinas' },
    { icon: 'accessibility_new', tag: 'Asistencia' }
  ]

  // Función para obtener el icono adecuado de material symbols
  const getIconSymbol = serviceType => {
    // Mapeo de servicios a iconos de Material Symbols más completo
    const iconMap = {
      Alojamiento: 'hotel',
      Transporte: 'directions_car',
      Boletos: 'local_activity',
      Snacks: 'cookie',
      Bebidas: 'wine_bar',
      Desayuno: 'egg_alt',
      Almuerzo: 'dinner_dining',
      Cena: 'restaurant',
      'Guía turístico': 'tour',
      'Seguro de viaje': 'health_and_safety',
      Actividades: 'theater_comedy',
      Fotografías: 'photo_camera',
      Souvenirs: 'redeem',
      Equipamiento: 'hiking',
      Wifi: 'wifi',
      Propinas: 'paid',
      'Asistencia 24/7': 'support_agent'
    }

    return iconMap[serviceType] || 'check_circle'
  }

  // Procesamiento de los servicios incluidos
  const processedIncludes = hasIncludes
    ? tour.includes
        .map(service => {
          // Si el servicio ya viene como objeto con propiedades completas
          if (typeof service === 'object' && service !== null) {
            return {
              type: service.type,
              icon: getIconSymbol(service.type),
              details: service.details || '',
              description: service.description || ''
            }
          }

          // Si el servicio viene como string
          if (typeof service === 'string') {
            return {
              type: service,
              icon: getIconSymbol(service),
              details: '',
              description: ''
            }
          }

          return null
        })
        .filter(Boolean)
    : []

  // Si no hay servicios incluidos dinámicos, mostrar algunos estáticos como respaldo
  const servicesToDisplay =
    processedIncludes.length > 0
      ? processedIncludes.slice(0, 6) // Mostrar hasta 6 servicios dinámicos
      : incluye.slice(0, 6) // Mostrar 6 servicios estáticos por defecto

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-10">
        <div className="lg:col-span-3 pr-0 pl-0">
          {/* Card Descripción */}
          <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
            <div>
              <h2 className="text-2xl font-bold mb-6">Descripción</h2>
            </div>
            <p className="text-gray-800">{tour.description || 'No hay descripción disponible para este tour.'}</p>
          </Card>

          {/* Card Incluye - Con nuevo estilo */}
          <Card className="rounded-lg border border-gray-300 mb-8 p-6 text-md">
            <h2 className="text-2xl font-bold mb-5">Incluye</h2>
            <CardBody className="p-0">
              {processedIncludes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {processedIncludes.map((service, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-red-500">{service.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{service.type}</p>
                        {service.details && <p className="text-sm text-gray-500">{service.details}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay servicios incluidos disponibles para este tour.</p>
              )}
            </CardBody>
          </Card>

          {/* Card Estado */}
          <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
            <h2 className="text-2xl font-bold mb-4">Estado del tour</h2>
            <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
                <span className="text-gray-700">Estado: {tour?.status?.status || 'Disponible'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-blue-500">date_range</span>
                <span className="text-gray-700">
                  Creado:{' '}
                  {tour?.creationDate
                    ? new Date(tour.creationDate[0], tour.creationDate[1] - 1, tour.creationDate[2]).toLocaleDateString()
                    : 'Fecha no disponible'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-orange-500">stars</span>
                <span className="text-gray-700">Hotel: {tour?.hotel?.stars ? `${tour.hotel.stars} estrellas` : 'No especificado'}</span>
              </div>
            </div>
          </Card>

          {/* Card Hotel */}
          {tour?.hotel?.name && (
            <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
              <h2 className="text-2xl font-bold mb-4">Hotel</h2>
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-2xl text-red-500">hotel</span>
                <div>
                  <p className="font-medium text-gray-800">{tour.hotel.name}</p>
                  <div className="flex text-amber-400">
                    {[...Array(tour.hotel.stars || 0)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined">
                        star
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Card Detalles - Se conserva como en original */}
          <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
            <h2 className="text-2xl font-bold mb-4">Detalles</h2>
            <div className="grid grid-cols-2 gap-4">
              <Chip size="sm" variant="flat" color="primary" className="flex items-center justify-start px-3">
                <span className="material-symbols-outlined icon text-base mr-2 flex-shrink-0">face</span>
                Edad: 12 a 99 años
              </Chip>
              <Chip size="sm" variant="flat" color="primary" className="flex items-center justify-start px-3">
                <span className="material-symbols-outlined icon text-base mr-2 flex-shrink-0">groups</span>
                Cupos: 9 cupos
              </Chip>
              <Chip size="sm" variant="flat" color="primary" className="flex items-center justify-start px-3">
                <span className="material-symbols-outlined icon text-base mr-2 flex-shrink-0">schedule</span>
                Duración: 1h 30m
              </Chip>
              <Chip size="sm" variant="flat" color="primary" className="flex items-center justify-start px-3">
                <span className="material-symbols-outlined icon text-base mr-2 flex-shrink-0">language</span>
                Guía: inglés-español
              </Chip>
            </div>
          </Card>

          {/* Card Itinerario - Se conserva como en original */}
          <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
            <h2 className="text-2xl font-bold mb-4">Itinerario</h2>
            <div className="relative pl-6">
              <div className="absolute left-[0.35rem] top-0 bottom-0 w-0.5 bg-gray-300"></div>
              <ul className="text-slate-700 list-none space-y-4">
                <li className="relative">
                  <div className="absolute left-[-1.38rem] top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                  Visita a la Viña Errázuriz
                </li>
                <li className="relative">
                  <div className="absolute left-[-1.38rem] top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                  Paseo por la Viña
                </li>
                <li className="relative">
                  <div className="absolute left-[-1.38rem] top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                  Degustación de vinos y cóctel
                </li>
                <li className="relative">
                  <div className="absolute left-[-1.38rem] top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                  Caminata por el Valle de Quillota
                </li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Columna derecha con CardDetalle y fecha */}
        <CardDetalle tour={tour} />
      </div>
    </div>
  )
}

export default BodyDetalle
