import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Tabs, Tab } from '@heroui/react'
import { createTour } from '@services/tourService.js'

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
    // **
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
    // **
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

const CrearTourForm = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    adultPrice: '',
    childPrice: '',
    images: ['', ''],
    status: 'Disponible',
    tags: [], // Usará los valores del backend (BEACH, VACATION, etc.)
    includes: [],
    destination: {
      region: 'Americas', // Solo para UI, no se envía al backend
      country: '',
      city: ''
    },
    hotelName: '',
    hotel: 4 // Corresponde a las estrellas
  })

  // Estado para los detalles de cada servicio incluido
  const [includesDetails, setIncludesDetails] = useState({})

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.')

      if (parts.length === 2) {
        // Para campos como 'destination.country' o 'destination.city'
        const updatedData = {
          ...formData,
          [parts[0]]: {
            ...formData[parts[0]],
            [parts[1]]: value
          }
        }
        console.log(`Nuevo estado para ${field}:`, updatedData[parts[0]])
        setFormData(updatedData)
      } else {
        // Para cualquier otro nivel de anidación (aunque ya no deberíamos tener campos de 3 niveles)
        console.warn('Campo con múltiples niveles no esperado:', field)
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

  const handleTagToggle = tag => {
    const currentTags = [...formData.tags]
    const index = currentTags.indexOf(tag)

    if (index === -1) {
      // Añadir tag
      currentTags.push(tag)
    } else {
      // Quitar tag
      currentTags.splice(index, 1)
    }

    setFormData({
      ...formData,
      tags: currentTags
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
      // Quitar servicio
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

      // Filtrar imágenes vacías
      const filteredImages = formData.images.filter(img => img.trim() !== '')
      if (filteredImages.length === 0) {
        filteredImages.push('https://via.placeholder.com/800x600?text=Imagen+del+tour')
      }

      // Enviar solicitud a la API
      const result = await createTour({
        ...formData,
        images: filteredImages,
        adultPrice: parseFloat(formData.adultPrice),
        childPrice: parseFloat(formData.childPrice || '0')
      })

      if (result.error) {
        throw new Error(result.message || 'Error al crear el tour')
      }

      console.log('Tour creado exitosamente:', result)

      // Resetear el formulario
      setFormData({
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
          city: {
            name: ''
          }
        },
        hotelName: '',
        hotel: 4
      })
      setIncludesDetails({})

      // Cerrar modal y notificar éxito
      onSuccess && onSuccess(result)
      onClose()
    } catch (error) {
      console.error('Error al crear el tour:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // CSS personalizado para inputs nativos
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
          <ModalHeader className="flex flex-col gap-1">Crear nuevo tour</ModalHeader>
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
                          checked={formData.tags.includes(categoria.value)}
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
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" type="button" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" type="submit" isLoading={loading}>
              Crear Tour
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CrearTourForm
