import { useState, useCallback, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch } from '@heroui/react'
import { updateUser, assignAdminRole, revokeAdminRole } from '@services/userService'
import { useAuth } from '@context/AuthContext'

import { USER_ROLES, USER_FORM_VALIDATIONS, DEFAULT_USER_FORM_DATA } from '../constants/tableConstants.js'

const generateRandomDocument = () => Math.floor(10000000 + Math.random() * 90000000).toString()
const generateRandomPhone = () => Math.floor(100000000 + Math.random() * 900000000).toString()
const DEFAULT_BIRTHDATE = '1986-03-21'
const MAX_BIRTHDATE = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]

const EditarUserForm = ({ isOpen, onClose, onSuccess, userData }) => {
  const { user: currentUser } = useAuth()
  const [formData, setFormData] = useState(DEFAULT_USER_FORM_DATA)
  const [originalRole, setOriginalRole] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    if (userData) {
      setFormData({
        image: userData.image || '',
        name: userData.name || '',
        lastName: userData.lastName || '',
        document: userData.document || generateRandomDocument(),
        phone: userData.phone || generateRandomPhone(),
        dateOfBirth: userData.dateOfBirth || DEFAULT_BIRTHDATE,
        email: userData.email || '',
        password: '',
        confirmPassword: '',
        role: userData.role || USER_ROLES.CLIENT
      })
      setOriginalRole(userData.role || USER_ROLES.CLIENT)
    }
  }, [userData])

  const validateForm = () => {
    const newErrors = {}

    // Validar campos requeridos
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido'
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!USER_FORM_VALIDATIONS.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Validar fecha de nacimiento
    const birthDate = new Date(formData.dateOfBirth)
    const maxDate = new Date(MAX_BIRTHDATE)
    if (birthDate > maxDate) {
      newErrors.dateOfBirth = 'Debe ser mayor de 18 años'
    }

    // Validar contraseña solo si se está intentando cambiar
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      // Limpiar error del campo cuando el usuario empieza a escribir
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }))
      }
    },
    [errors]
  )

  const handleRoleChange = async newRole => {
    try {
      // Si no es superadmin y está intentando cambiar a ADMIN, mostrar error
      if (newRole === USER_ROLES.ADMIN && !currentUser?.isSuperAdmin) {
        setErrors(prev => ({
          ...prev,
          role: 'Solo el superadmin puede asignar rol de administrador'
        }))
        return
      }

      setFormData(prev => ({ ...prev, role: newRole }))
    } catch (error) {
      setApiError(error.message)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setApiError(null)

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)

      if (formData.role !== originalRole) {
        if (formData.role === USER_ROLES.ADMIN) {
          await assignAdminRole(userData.id, currentUser.email)
        } else {
          await revokeAdminRole(userData.id, currentUser.email)
        }
      }

      // Solo incluir los campos que han sido modificados o que son obligatorios
      const updateData = {
        ...userData, // Mantener los datos originales
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
        document: formData.document,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email.trim(),
        image: formData.image?.trim() || userData.image || ''
      }

      // Solo incluir password si se está cambiando
      if (formData.password) {
        updateData.password = formData.password
      }

      await updateUser(userData.email, updateData)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      setApiError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      classNames={{
        backdrop: 'bg-[#292f46]/50 backdrop-opacity-40',
        base: 'border-[#292f46] bg-white dark:bg-gray-800'
      }}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Editar Usuario</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Datos básicos */}
              <Input
                type="text"
                label="Nombre *"
                placeholder="Ingrese el nombre"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                color={errors.name ? 'danger' : 'default'}
                errorMessage={errors.name}
                className="w-full"
              />

              <Input
                type="text"
                label="Apellido *"
                placeholder="Ingrese el apellido"
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                color={errors.lastName ? 'danger' : 'default'}
                errorMessage={errors.lastName}
                className="w-full"
              />

              <Input
                type="text"
                label="Documento"
                placeholder="Ingrese el documento"
                value={formData.document}
                onChange={e => handleInputChange('document', e.target.value)}
                className="w-full"
              />

              <Input
                type="tel"
                label="Teléfono"
                placeholder="Ingrese el teléfono (9 dígitos)"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                color={errors.phone ? 'danger' : 'default'}
                errorMessage={errors.phone}
                className="w-full"
              />

              <Input
                type="date"
                label="Fecha de Nacimiento *"
                value={formData.dateOfBirth}
                onChange={e => handleInputChange('dateOfBirth', e.target.value)}
                color={errors.dateOfBirth ? 'danger' : 'default'}
                errorMessage={errors.dateOfBirth}
                className="w-full"
                max={MAX_BIRTHDATE}
              />

              <Input
                type="email"
                label="Email *"
                placeholder="Ingrese el email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                color={errors.email ? 'danger' : 'default'}
                errorMessage={errors.email}
                className="w-full"
                isDisabled
              />

              {/* URL de imagen */}
              <Input
                type="url"
                label="URL de Imagen"
                placeholder="https://..."
                value={formData.image}
                onChange={e => handleInputChange('image', e.target.value)}
                className="w-full"
              />

              {/* Selector de Rol */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Rol</label>
                <div className="flex items-center gap-2">
                  <Switch
                    isSelected={formData.role === USER_ROLES.ADMIN}
                    onValueChange={isAdmin => handleRoleChange(isAdmin ? USER_ROLES.ADMIN : USER_ROLES.CLIENT)}
                    size="lg"
                    color="danger"
                    isDisabled={!currentUser?.isSuperAdmin}
                    classNames={{
                      wrapper: 'bg-success-200 group-data-[selected=true]:bg-danger-200',
                      thumb: `
                        group-data-[selected=true]:bg-danger-500
                        group-data-[selected=true]:border-danger-500
                        group-data-[selected=false]:bg-success-500
                        group-data-[selected=false]:border-success-500
                      `
                    }}>
                    <span className="ml-2">{formData.role === USER_ROLES.ADMIN ? 'Administrador' : 'Usuario'}</span>
                  </Switch>
                </div>
                {!currentUser?.isSuperAdmin && <span className="text-xs text-gray-500 mt-1">Solo el superadmin puede modificar roles</span>}
                {errors.role && <span className="text-danger text-xs">{errors.role}</span>}
              </div>

              {/* Contraseñas (opcionales para edición) */}
              <div className="col-span-2">
                <div className="mb-2 text-sm text-gray-500">Cambio de Contraseña (opcional)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="password"
                    label="Nueva Contraseña"
                    placeholder="********"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    color={errors.password ? 'danger' : 'default'}
                    errorMessage={errors.password}
                    className="w-full"
                  />

                  <Input
                    type="password"
                    label="Confirmar Nueva Contraseña"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    color={errors.confirmPassword ? 'danger' : 'default'}
                    errorMessage={errors.confirmPassword}
                    className="w-full"
                    isDisabled={!formData.password}
                  />
                </div>
              </div>
            </div>

            {apiError && <div className="mt-4 text-danger text-sm">{apiError}</div>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button color="primary" type="submit" disabled={isLoading} isLoading={isLoading}>
              Guardar Cambios
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditarUserForm
