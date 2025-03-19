import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Tabs, Tab } from '@heroui/react'
import { updateTour } from '@services/tourService.js'

// Constantes compartidas para categorías, servicios y regiones
const CATEGORIAS = [
  { value: 'BEACH', label: 'Playa' },
  { value: 'VACATION', label: 'Vacaciones' },
  { value: 'ADVENTURE', label: 'Aventura' },
  { value: 'ECOTOURISM', label: 'Ecoturismo' },
  { value: 'LUXURY', label: 'Lujo' },
  { value: 'CITY', label: 'Urbano' },
  { value: 'MOUNTAIN', label: 'Montaña' },
  { value: 'CRUISE', label: 'Crucero' },
  { value: 'ADRENALIN', label: 'Adrenalina' }
]

const SERVICIOS = [
  {
    value: 'Alojamiento',
    label: 'Alojamiento',
    icon: 'hotel',
    defaultDetails: '2 Alcobas',
    description: 'Hospedaje en hotel, hostal o cabaña'
  },
  {
    value: 'Transporte',
    label: 'Transporte',
    icon: 'directions_car',
    defaultDetails: '2 Vuelos',
    description: 'Traslados terrestres, aéreos o marítimos'
  },
  {
    value: 'Boletos',
    label: 'Boletos',
    icon: 'local_activity',
    defaultDetails: 'Entradas',
    description: 'Tickets de acceso a atracciones o eventos'
  },
  {
    value: 'Snacks',
    label: 'Snacks',
    icon: 'cookie',
    defaultDetails: 'Todo el día',
    description: 'Aperitivos entre comidas'
  },
  {
    value: 'Bebidas',
    label: 'Bebidas',
    icon: 'wine_bar',
    defaultDetails: 'Ilimitadas',
    description: 'Bebidas sin alcohol incluidas en la experiencia'
  },
  {
    value: 'Desayuno',
    label: 'Desayuno',
    icon: 'egg_alt',
    defaultDetails: '7:00 - 9:00',
    description: 'Primera comida del día incluida'
  },
  {
    value: 'Almuerzo',
    label: 'Almuerzo',
    icon: 'dinner_dining',
    defaultDetails: '12:00 - 14:00',
    description: 'Comida principal del mediodía'
  },
  {
    value: 'Cena',
    label: 'Cena',
    icon: 'restaurant',
    defaultDetails: '19:00 - 21:00',
    description: 'Comida de la noche'
  },
  {
    value: 'Guía turístico',
    label: 'Guía turístico',
    icon: 'tour',
    defaultDetails: 'Personal',
    description: 'Acompañamiento profesional durante el recorrido'
  },
  {
    value: 'Seguro de viaje',
    label: 'Seguro de viaje',
    icon: 'health_and_safety',
    defaultDetails: 'Cobertura total',
    description: 'Protección y asistencia durante el viaje'
  },
  {
    value: 'Actividades',
    label: 'Actividades',
    icon: 'theater_comedy',
    defaultDetails: '2 Experiencias',
    description: 'Excursiones, deportes o experiencias guiadas'
  },
  {
    value: 'Fotografías',
    label: 'Fotografías',
    icon: 'photo_camera',
    defaultDetails: 'Sesión',
    description: 'Servicio fotográfico durante la experiencia'
  },
  {
    value: 'Souvenirs',
    label: 'Souvenirs',
    icon: 'redeem',
    defaultDetails: 'Recuerdos',
    description: 'Objetos conmemorativos del destino'
  },
  {
    value: 'Equipamiento',
    label: 'Equipamiento',
    icon: 'hiking',
    defaultDetails: 'Completo',
    description: 'Material necesario para actividades específicas'
  },
  {
    value: 'Wifi',
    label: 'Wifi',
    icon: 'wifi',
    defaultDetails: 'Conexión',
    description: 'Conectividad a internet en el transporte o alojamiento'
  },
  {
    value: 'Propinas',
    label: 'Propinas',
    icon: 'paid',
    defaultDetails: 'Incluidas',
    description: 'Gratificaciones para el personal de servicio'
  },
  {
    value: 'Asistencia 24/7',
    label: 'Asistencia 24/7',
    icon: 'support_agent',
    defaultDetails: '24/7',
    description: 'Ayuda disponible durante toda la experiencia'
  }
]

// Regiones disponibles
const REGIONES = [
  { value: 'Americas', label: 'América' },
  { value: 'Europe', label: 'Europa' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Africa', label: 'África' },
  { value: 'Oceania', label: 'Oceanía' }
]

// Función para obtener fecha y hora actual en formato ISO para los inputs datetime-local
const getCurrentDateTimeISO = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

// Función para obtener fecha futura (en días) en formato ISO
const getFutureDateTimeISO = days => {
  const future = new Date()
  future.setDate(future.getDate() + days)
  future.setMinutes(future.getMinutes() - future.getTimezoneOffset())
  return future.toISOString().slice(0, 16)
}

const EditarTourForm = ({ isOpen, onClose, onSuccess, tourData }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    adultPrice: '',
    childPrice: '',
    images: ['', ''],
    status: 'Disponible',
    tags: [],
    includes: [],
    destination: {
      region: 'Americas',
      country: '',
      city: ''
    },
    hotelName: '',
    hotel: 4,
    availability: [
      {
        availableDate: getFutureDateTimeISO(30),
        availableSlots: 10,
        departureTime: getFutureDateTimeISO(7),
        returnTime: getFutureDateTimeISO(14)
      }
    ]
  })

  // Estado para los detalles de cada servicio incluido
  const [includesDetails, setIncludesDetails] = useState({})
  const [availabilityCount, setAvailabilityCount] = useState(1)

  // Cargar datos del tour cuando cambia tourData
  useEffect(() => {
    if (tourData && isOpen) {
      console.log('Cargando datos del tour para editar:', tourData)

      // Preparar imágenes (asegurar que siempre hay al menos dos slots para imágenes)
      const images = Array.isArray(tourData.imagenes) ? [...tourData.imagenes] : []
      while (images.length < 2) {
        images.push('')
      }

      // Convertir precio a string para input
      const adultPrice = tourData.precio ? tourData.precio.toString() : ''
      const childPrice = tourData.childPrice ? tourData.childPrice.toString() : ''

      // Extraer ciudad y país del destino
      const country = tourData.destination?.country || ''
      const city =
        typeof tourData.destination?.city === 'object' ? tourData.destination?.city?.name || '' : tourData.destination?.city || ''

      // Determinar región basada en el país si no está explícita
      let region = 'Americas' // valor por defecto
      if (tourData.destination?.region) {
        region = tourData.destination.region
      }

      // FILTRAR TAGS - ASEGURARSE DE QUE SEAN VALORES ENUM VÁLIDOS
      let tags = []
      if (Array.isArray(tourData.tags)) {
        tags = tourData.tags.map(tag => {
          const matchedCategory = CATEGORIAS.find(cat => cat.value === tag)
          return matchedCategory ? matchedCategory.label : tag // Usar el label en español
        })
      } else if (tourData.categoria) {
        // Si solo tenemos la categoría principal, usarla solo si es un valor ENUM válido
        if (CATEGORIAS.some(cat => cat.value === tourData.categoria)) {
          tags = [tourData.categoria]
        }
      }

      if (tourData) {
        setFormData(prevData => ({
          ...prevData,
          tags: tourData.tags.map(tag => {
            const matchedCategory = CATEGORIAS.find(cat => cat.value === tag)
            return matchedCategory ? matchedCategory.label : tag // Convertir inglés → español
          })
        }))
      }

      console.log('Tags filtrados para edición:', tags)

      // Preparar datos de disponibilidad
      let availability = [
        {
          availableDate: getFutureDateTimeISO(30),
          availableSlots: 10,
          departureTime: getFutureDateTimeISO(7),
          returnTime: getFutureDateTimeISO(14)
        }
      ]

      // Si el tour tiene datos de disponibilidad, usarlos
      if (tourData.availability) {
        if (Array.isArray(tourData.availability)) {
          availability = [...tourData.availability]
          setAvailabilityCount(tourData.availability.length)
        } else {
          availability = [
            {
              availableDate: tourData.availability.availableDate || availability[0].availableDate,
              availableSlots: tourData.availability.availableSlots || availability[0].availableSlots,
              departureTime: tourData.availability.departureTime || availability[0].departureTime,
              returnTime: tourData.availability.returnTime || availability[0].returnTime
            }
          ]
        }
      }

      // Inicializar detalles de servicios incluidos
      const details = {}
      if (Array.isArray(tourData.includes)) {
        tourData.includes.forEach(include => {
          if (typeof include === 'object') {
            details[include.type] = {
              details: include.details || '',
              description: include.description || ''
            }
          }
        })
      }
      setIncludesDetails(details)

      // Initialize formData with existing tourData, including tags
      setFormData({
        name: tourData.nombre || '',
        description: tourData.description || '',
        adultPrice,
        childPrice,
        images,
        status: tourData.status || 'Disponible',
        tags: tags, // Ensure tags are set correctly
        includes: Array.isArray(tourData.includes) ? tourData.includes.map(inc => (typeof inc === 'object' ? inc.type : inc)) : [],
        destination: {
          region,
          country,
          city
        },
        hotelName: tourData.hotel?.name || '',
        hotel: typeof tourData.hotel === 'object' ? tourData.hotel.stars : tourData.hotel || 4,
        availability
      })
    }
  }, [tourData, isOpen])

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.')

      if (parts.length === 2) {
        setFormData({
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: value
          }
        })
      } else {
        setFormData({
          ...formData,
          [field]: value
        })
      }
    } else {
      setFormData({
        ...formData,
        [field]: value
      })
    }
  }

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({
      ...formData,
      images: newImages
    })
  }

  const handleTagToggle = tagValue => {
    setFormData(prevData => {
      // Convertir de inglés a español
      const matchedCategory = CATEGORIAS.find(cat => cat.value === tagValue)
      const tagLabel = matchedCategory ? matchedCategory.label : tagValue

      // Alternar selección
      const updatedTags = prevData.tags.includes(tagLabel)
        ? prevData.tags.filter(tag => tag !== tagLabel) // Remueve si ya estaba
        : [...prevData.tags, tagLabel] // Agrega si no estaba

      return { ...prevData, tags: updatedTags }
    })
  }

  const handleServiceToggle = service => {
    const currentServices = [...formData.includes]
    const index = currentServices.indexOf(service)

    if (index === -1) {
      currentServices.push(service)

      // Inicializar los detalles si no existen
      const serviceInfo = SERVICIOS.find(s => s.value === service)

      if (serviceInfo && !includesDetails[service]) {
        setIncludesDetails({
          ...includesDetails,
          [service]: {
            details: serviceInfo.defaultDetails,
            description: serviceInfo.description
          }
        })
      }
    } else {
      currentServices.splice(index, 1)
    }

    setFormData({
      ...formData,
      includes: currentServices
    })
  }

  const handleIncludeDetailChange = (service, field, value) => {
    setIncludesDetails({
      ...includesDetails,
      [service]: {
        ...includesDetails[service],
        [field]: value
      }
    })
  }

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability]

    // Asegurarse de que el objeto existe en ese índice
    if (!newAvailability[index]) {
      newAvailability[index] = {
        availableDate: getFutureDateTimeISO(30),
        availableSlots: 10,
        departureTime: getFutureDateTimeISO(7),
        returnTime: getFutureDateTimeISO(14)
      }
    }

    // Actualizar campo específico
    newAvailability[index][field] = value

    setFormData({
      ...formData,
      availability: newAvailability
    })
  }

  const handleAddAvailability = () => {
    const newAvailability = [...formData.availability]
    newAvailability.push({
      availableDate: getFutureDateTimeISO(30 + availabilityCount * 7),
      availableSlots: 10,
      departureTime: getFutureDateTimeISO(7 + availabilityCount * 7),
      returnTime: getFutureDateTimeISO(14 + availabilityCount * 7)
    })

    setFormData({
      ...formData,
      availability: newAvailability
    })

    setAvailabilityCount(availabilityCount + 1)
  }

  const handleRemoveAvailability = index => {
    if (formData.availability.length <= 1) {
      return
    }

    const newAvailability = formData.availability.filter((_, i) => i !== index)

    setFormData({
      ...formData,
      availability: newAvailability
    })
    setAvailabilityCount(availabilityCount - 1)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validar datos mínimos requeridos
      if (!formData.name) {
        throw new Error('El nombre del tour es obligatorio')
      }

      if (!formData.description) {
        throw new Error('La descripción del tour es obligatoria')
      }

      if (!formData.adultPrice) {
        throw new Error('El precio para adultos es obligatorio')
      }

      if (!formData.destination.country || !formData.destination.city) {
        throw new Error('El destino (país y ciudad) es obligatorio')
      }

      if (formData.tags.length === 0) {
        throw new Error('Debes seleccionar al menos una categoría')
      }

      if (formData.includes.length === 0) {
        throw new Error('Debes seleccionar al menos un servicio incluido')
      }

      // Validar cada objeto de disponibilidad
      for (let i = 0; i < formData.availability.length; i++) {
        const avail = formData.availability[i]

        if (!avail.availableDate) {
          throw new Error(`Fecha disponible para reserva ${i + 1} es obligatoria`)
        }

        if (!avail.departureTime) {
          throw new Error(`Fecha y hora de salida ${i + 1} es obligatoria`)
        }

        if (!avail.returnTime) {
          throw new Error(`Fecha y hora de regreso ${i + 1} es obligatoria`)
        }

        // Verificar que la fecha de regreso sea posterior a la de salida
        const departureDate = new Date(avail.departureTime)
        const returnDate = new Date(avail.returnTime)

        if (returnDate <= departureDate) {
          throw new Error(`La fecha de regreso ${i + 1} debe ser posterior a la fecha de salida`)
        }

        // Verificar que haya al menos un cupo disponible
        if (parseInt(avail.availableSlots) < 1) {
          throw new Error(`Debe haber al menos un cupo disponible en la disponibilidad ${i + 1}`)
        }
      }

      // Filtrar imágenes vacías
      const filteredImages = formData.images.filter(img => img.trim() !== '')
      if (filteredImages.length === 0) {
        filteredImages.push('https://via.placeholder.com/800x600?text=Imagen+del+tour')
      }

      // ASEGURAR QUE LOS TAGS SEAN VALORES ENUM VÁLIDOS
      const validTags = formData.tags.map(tag => {
        const matchedCategory = CATEGORIAS.find(cat => cat.label === tag)
        return matchedCategory ? matchedCategory.value : tag // Convertir español → inglés
      })

      console.log('Tags validados para actualizar:', validTags)

      // IMPORTANTE: Crear el objeto exactamente como lo espera el backend según Swagger
      const requestData = {
        name: formData.name,
        description: formData.description,
        adultPrice: parseFloat(formData.adultPrice),
        childPrice: parseFloat(formData.childPrice || '0'),
        // Aseguramos que images sea un array de strings
        images: filteredImages,
        // Status debe ser un string
        status: 'Disponible', // Valor fijo por ahora según Swagger
        // Tags solo incluyen valores ENUM válidos
        tags: validTags,
        // Includes deben ser un array de strings
        includes: formData.includes,
        // La estructura de destination debe ser exactamente como la espera el backend
        destination: {
          country: formData.destination.country,
          city: formData.destination.city
        },
        // Hotel debe ser un número
        hotel: parseInt(formData.hotel),
        // Availability con el formato exacto
        availability: formData.availability.map(avail => ({
          ...avail,
          availableSlots: parseInt(avail.availableSlots)
        }))
      }

      console.log('Datos preparados para actualizar:', requestData)

      // Enviar solicitud de actualización con el ID exacto del paquete
      const result = await updateTour(tourData.idPaquete, requestData)

      if (result.error) {
        throw new Error(result.message || 'Error al actualizar el tour')
      }

      console.log('Tour actualizado exitosamente:', result)

      // Notificar éxito y cerrar
      onSuccess && onSuccess(result)
      onClose()
    } catch (error) {
      console.error('Error al actualizar el tour:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Estilos para componentes nativos
  const selectStyle =
    'block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E86C6E] focus:border-[#E86C6E]'
  const checkboxContainerStyle = 'flex items-center gap-2 mb-2'
  const checkboxStyle = 'form-checkbox h-5 w-5 text-[#E86C6E] border-gray-300 rounded focus:ring-[#E86C6E]'
  const labelStyle = 'text-sm font-medium text-gray-700'
  const errorStyle = 'text-red-500 text-sm mt-2'

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <ModalHeader className="flex flex-col gap-1">Editar tour</ModalHeader>
          <ModalBody>
            {error && <div className={errorStyle}>{error}</div>}

            <Tabs aria-label="Secciones del formulario">
              <Tab key="informacion" title="Información básica">
                <div className="space-y-4 py-2">
                  <Input
                    label="Nombre del tour"
                    placeholder="Ej: Playas del Caribe"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    required
                  />

                  <Textarea
                    label="Descripción"
                    placeholder="Describe la experiencia del tour..."
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    required
                    minRows={3}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Precio adultos"
                      placeholder="Precio en USD"
                      startContent={<div className="pointer-events-none">$</div>}
                      value={formData.adultPrice}
                      onChange={e => handleInputChange('adultPrice', e.target.value)}
                      required
                    />

                    <Input
                      type="number"
                      label="Precio niños"
                      placeholder="Precio en USD"
                      startContent={<div className="pointer-events-none">$</div>}
                      value={formData.childPrice}
                      onChange={e => handleInputChange('childPrice', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Imágenes (URLs)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="URL de la imagen 1"
                        value={formData.images[0]}
                        onChange={e => handleImageChange(0, e.target.value)}
                      />
                      <Input
                        placeholder="URL de la imagen 2"
                        value={formData.images[1]}
                        onChange={e => handleImageChange(1, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="destino" title="Destino y Hotel">
                <div className="space-y-4 py-2">
                  <div className="mb-4">
                    <label htmlFor="region" className={labelStyle}>
                      Región
                    </label>
                    <select
                      id="region"
                      className={selectStyle}
                      value={formData.destination.region}
                      onChange={e => handleInputChange('destination.region', e.target.value)}
                      required>
                      {REGIONES.map(region => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="País"
                      placeholder="Ej: Colombia"
                      value={formData.destination.country}
                      onChange={e => handleInputChange('destination.country', e.target.value)}
                      required
                    />

                    <Input
                      label="Ciudad"
                      placeholder="Ej: Cartagena"
                      value={formData.destination.city}
                      onChange={e => handleInputChange('destination.city', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre del hotel"
                      placeholder="Ej: Gran Hotel Resort & Spa"
                      value={formData.hotelName}
                      onChange={e => handleInputChange('hotelName', e.target.value)}
                    />

                    <div className="mb-4">
                      <label htmlFor="hotel" className={labelStyle}>
                        Estrellas del hotel
                      </label>
                      <select
                        id="hotel"
                        className={selectStyle}
                        value={formData.hotel}
                        onChange={e => handleInputChange('hotel', parseInt(e.target.value))}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <option key={star} value={star}>
                            {star} {star === 1 ? 'Estrella' : 'Estrellas'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Tab>

              <Tab key="categorias" title="Categorías">
                <div className="space-y-4 py-2">
                  <p className="text-sm font-medium mb-3">Categorías del tour</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CATEGORIAS.map(categoria => (
                      <div key={categoria.value} className={checkboxContainerStyle}>
                        <input
                          type="checkbox"
                          id={`categoria-${categoria.value}`}
                          className={checkboxStyle}
                          value={categoria.value}
                          checked={formData.tags.includes(categoria.label)}
                          onChange={() => handleTagToggle(categoria.value)}
                        />
                        <label htmlFor={`categoria-${categoria.value}`} className={labelStyle}>
                          {categoria.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab>

              <Tab key="servicios" title="Servicios incluidos">
                <div className="space-y-4 py-2">
                  <p className="text-sm font-medium mb-3">Selecciona los servicios incluidos</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {SERVICIOS.map(servicio => (
                      <div key={servicio.value} className={checkboxContainerStyle}>
                        <input
                          type="checkbox"
                          id={`servicio-${servicio.value}`}
                          className={checkboxStyle}
                          value={servicio.value}
                          checked={formData.includes.includes(servicio.value)}
                          onChange={() => handleServiceToggle(servicio.value)}
                        />
                        <label htmlFor={`servicio-${servicio.value}`} className={labelStyle}>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">{servicio.icon}</span>
                            {servicio.label}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>

                  {formData.includes.length > 0 && (
                    <div className="mt-4 border p-4 rounded-lg">
                      <p className="text-sm font-medium mb-3">Detalles de los servicios incluidos</p>
                      <div className="space-y-4">
                        {formData.includes.map(service => {
                          const serviceInfo = SERVICIOS.find(s => s.value === service)
                          const details = includesDetails[service] || {
                            details: serviceInfo?.defaultDetails || '',
                            description: serviceInfo?.description || ''
                          }

                          return (
                            <div key={service} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined">{serviceInfo?.icon || 'check'}</span>
                                <span className="font-medium">{service}</span>
                              </div>

                              <div className="space-y-2">
                                <Input
                                  size="sm"
                                  label="Detalles"
                                  placeholder="Ej: 2 Alcobas, Ilimitado, etc."
                                  value={details.details}
                                  onChange={e => handleIncludeDetailChange(service, 'details', e.target.value)}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </Tab>

              {/* Pestaña de disponibilidad */}
              <Tab key="disponibilidad" title="Disponibilidad">
                <div className="space-y-4 py-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium mb-3">Fechas de disponibilidad</p>
                    <Button size="sm" color="primary" variant="flat" onClick={handleAddAvailability}>
                      <span className="material-symbols-outlined mr-1">add</span>
                      Añadir fecha
                    </Button>
                  </div>

                  {formData.availability.map((avail, index) => (
                    <div key={index} className="mb-8 p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-medium">Disponibilidad {index + 1}</h3>
                        {formData.availability.length > 1 && (
                          <Button size="sm" color="danger" variant="light" onClick={() => handleRemoveAvailability(index)}>
                            <span className="material-symbols-outlined">delete</span>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Input
                              type="datetime-local"
                              label="Fecha disponible para reserva"
                              placeholder="Seleccione fecha y hora"
                              value={avail.availableDate}
                              onChange={e => handleAvailabilityChange(index, 'availableDate', e.target.value)}
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">Fecha límite para reservar</p>
                          </div>
                          <div>
                            <Input
                              type="number"
                              label="Cupos disponibles"
                              placeholder="Número de plazas"
                              min="1"
                              value={avail.availableSlots}
                              onChange={e => handleAvailabilityChange(index, 'availableSlots', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <Input
                              type="datetime-local"
                              label="Fecha y hora de salida"
                              placeholder="Seleccione fecha y hora"
                              value={avail.departureTime}
                              onChange={e => handleAvailabilityChange(index, 'departureTime', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Input
                              type="datetime-local"
                              label="Fecha y hora de regreso"
                              placeholder="Seleccione fecha y hora"
                              value={avail.returnTime}
                              onChange={e => handleAvailabilityChange(index, 'returnTime', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Nota:</span> Puedes agregar múltiples fechas de disponibilidad para este tour. La fecha
                      de disponibilidad indica hasta cuándo los clientes pueden reservar este tour. Las fechas de salida y regreso definen
                      cuándo comienza y termina el tour.
                    </p>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" type="button" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit" isLoading={loading}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditarTourForm
