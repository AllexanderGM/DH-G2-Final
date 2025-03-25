import { useCallback, useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Avatar } from '@heroui/react'
import { updateUser } from '@services/userService'

const ROLES = [
  { value: 'CLIENT', label: 'Cliente' },
  { value: 'ADMIN', label: 'Administrador' }
]

const EditarUserForm = ({ isOpen, onClose, onSuccess, userData }) => {
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    lastName: '',
    document: '',
    phone: '',
    dateOfBirth: '',
    email: '',
    password: '',
    address: '',
    city: '',
    role: 'CLIENT'
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  // Cargar datos del usuario cuando cambia userData
  useEffect(() => {
    if (userData) {
      console.log('Cargando datos de usuario para edición:', userData)

      // Parsear el username si viene en formato "nombre apellido"
      let firstName = userData.name || ''
      let lastName = userData.lastName || ''

      // Si tenemos username pero no name/lastName, intentamos extraerlos del username
      if (userData.username && (!userData.name || !userData.lastName)) {
        const nameParts = userData.username.split(' ')
        if (nameParts.length > 1) {
          firstName = nameParts[0] || ''
          lastName = nameParts.slice(1).join(' ') || ''
        } else {
          firstName = userData.username || ''
        }
      }

      setFormData({
        image: userData.avatar || userData.image || 'https://i.pravatar.cc/150',
        name: firstName,
        lastName: lastName,
        document: userData.document || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        email: userData.email || '',
        password: '', // Dejamos vacío por seguridad
        address: userData.address || '',
        city: userData.city || '',
        role: userData.role || 'CLIENT'
      })
    }
  }, [userData, isOpen]) // Añadimos isOpen para asegurar que se recarguen los datos al abrir el modal

  const validateForm = useCallback(() => {
    const newErrors = {}

    // Validaciones básicas de campos requeridos
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio'
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio'

    // Solo validar password si se ha introducido algo (para edición puede quedarse vacío)
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email.trim() && !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Ingrese un email válido'
    }

    // Validación de fecha
    if (formData.dateOfBirth) {
      const dateObj = new Date(formData.dateOfBirth)
      if (isNaN(dateObj.getTime())) {
        newErrors.dateOfBirth = 'La fecha no es válida'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleInputChange = useCallback(
    (name, value) => {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))

      // Limpiar error del campo modificado
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [errors]
  )

  const handleSubmit = useCallback(async () => {
    setGeneralError('')

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Identificador del usuario (preferimos ID, pero podemos usar email)
      const userId = userData.id || userData.email

      if (!userId) {
        throw new Error('No se pudo identificar al usuario para actualizarlo')
      }

      // Crear objeto de usuario con los datos a actualizar
      const updatedUserData = {
        ...formData
      }

      // Eliminar password si está vacío
      if (!updatedUserData.password) {
        delete updatedUserData.password
      }

      console.log(`Actualizando usuario ${userId} con datos:`, updatedUserData)

      const result = await updateUser(userId, updatedUserData)

      if (result.error) {
        throw new Error(result.message || 'Error al actualizar el usuario')
      }

      // Cerrar modal y notificar éxito
      onClose()
      onSuccess(result)
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      setGeneralError(error.message || 'Ha ocurrido un error al actualizar el usuario')
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, onClose, onSuccess, userData])

  const handleClose = useCallback(() => {
    setErrors({})
    setGeneralError('')
    onClose()
  }, [onClose])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Editar usuario</ModalHeader>

            <ModalBody>
              {generalError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{generalError}</div>}

              <div className="flex items-center justify-center mb-6">
                <Avatar src={formData.image} className="w-24 h-24" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Imagen (URL)"
                  placeholder="URL de la imagen de perfil"
                  value={formData.image}
                  onValueChange={value => handleInputChange('image', value)}
                  errorMessage={errors.image}
                  fullWidth
                />

                <Input
                  label="Nombre *"
                  placeholder="Nombre del usuario"
                  value={formData.name}
                  onValueChange={value => handleInputChange('name', value)}
                  errorMessage={errors.name}
                  isRequired
                  fullWidth
                />

                <Input
                  label="Apellido *"
                  placeholder="Apellido del usuario"
                  value={formData.lastName}
                  onValueChange={value => handleInputChange('lastName', value)}
                  errorMessage={errors.lastName}
                  isRequired
                  fullWidth
                />

                <Input
                  label="Documento"
                  placeholder="Número de documento"
                  value={formData.document}
                  onValueChange={value => handleInputChange('document', value)}
                  errorMessage={errors.document}
                  fullWidth
                />

                <Input
                  label="Teléfono"
                  placeholder="Número de teléfono"
                  value={formData.phone}
                  onValueChange={value => handleInputChange('phone', value)}
                  errorMessage={errors.phone}
                  fullWidth
                />

                <Input
                  label="Fecha de nacimiento"
                  placeholder="YYYY-MM-DD"
                  type="date"
                  value={formData.dateOfBirth}
                  onValueChange={value => handleInputChange('dateOfBirth', value)}
                  errorMessage={errors.dateOfBirth}
                  fullWidth
                />

                <Input
                  label="Email *"
                  placeholder="Correo electrónico"
                  type="email"
                  value={formData.email}
                  onValueChange={value => handleInputChange('email', value)}
                  errorMessage={errors.email}
                  isRequired
                  fullWidth
                />

                <Input
                  label="Contraseña"
                  placeholder="Dejar vacío para no cambiar"
                  type="password"
                  value={formData.password}
                  onValueChange={value => handleInputChange('password', value)}
                  errorMessage={errors.password}
                  fullWidth
                />

                <Input
                  label="Dirección"
                  placeholder="Dirección del usuario"
                  value={formData.address}
                  onValueChange={value => handleInputChange('address', value)}
                  errorMessage={errors.address}
                  fullWidth
                />

                <div className="w-full">
                  <label className="block text-small font-medium pb-1.5">Rol</label>
                  <select
                    className="w-full h-10 rounded-md px-3 py-2 border-2 border-neutral-200 bg-transparent text-black text-small focus:outline-none focus:border-primary"
                    value={formData.role}
                    onChange={e => handleInputChange('role', e.target.value)}>
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && <div className="text-red-500 text-xs mt-1">{errors.role}</div>}
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
                Actualizar usuario
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default EditarUserForm
