import { useState, useCallback, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Chip } from '@heroui/react'
import { updateUser, assignAdminRole, revokeAdminRole, getUserByEmail } from '@services/userService'
import { useAuth } from '@context/AuthContext'

import { USER_ROLES, USER_ROLE_COLORS, USER_FORM_VALIDATIONS, DEFAULT_USER_FORM_DATA } from '../constants/tableConstants'

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
        document: userData.document || '',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        email: userData.email || '',
        password: '',
        confirmPassword: '',
        address: userData.address || '',
        city: userData.city || '',
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
    if (!formData.document.trim()) newErrors.document = 'El documento es requerido'
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La fecha de nacimiento es requerida'

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!USER_FORM_VALIDATIONS.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Validar teléfono (9 dígitos exactos)
    if (formData.phone && !USER_FORM_VALIDATIONS.PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos'
    }

    // Validar contraseña solo si se está intentando cambiar
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    // Validar cambio de rol
    if (formData.role === USER_ROLES.ADMIN && originalRole !== USER_ROLES.ADMIN) {
      if (!currentUser?.isSuperAdmin) {
        newErrors.role = 'Solo el superadmin puede asignar rol de administrador'
      }
    }

    if (formData.role !== originalRole) {
      if (formData.role === USER_ROLES.ADMIN) {
        // Verificar si es superadmin
        if (!currentUser?.isSuperAdmin) {
          newErrors.role = 'Solo el superadmin puede asignar rol de administrador'
          console.log('Usuario actual no es SuperAdmin:', currentUser)
        }
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
        console.log('Cambiando rol de usuario:', userData.id, 'desde', originalRole, 'a', formData.role)
        console.log('Changing role for user ID:', userData.id)
        console.log('Current user (super admin):', currentUser.email)

        if (formData.role === USER_ROLES.ADMIN) {
          await assignAdminRole(userData.id, currentUser.email)
          const updatedUser = await getUserByEmail(userData.email)
          console.log('Updated user data:', updatedUser)
        } else {
          await revokeAdminRole(userData.id, currentUser.email)
        }
        // Esperar un momento para que el cambio de rol se procese completamente
        console.log('Cambio de rol completado')
      } else {
        console.log('No se está cambiando el rol, solo actualizando datos')
      }

      // Excluir campos innecesarios para la actualización
      const { confirmPassword, role, ...updateData } = formData
      console.log(updateData)

      // Solo incluir password si se está cambiando
      if (!updateData.password) {
        delete updateData.password
      }

      await updateUser(userData.email, updateData)

      onSuccess?.()
      onClose()
    } catch (error) {
      setApiError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      image: '',
      name: '',
      lastName: '',
      document: '',
      phone: '',
      dateOfBirth: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      role: ''
    })
    setErrors({})
    setApiError(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
                label="Documento *"
                placeholder="Ingrese el documento"
                value={formData.document}
                onChange={e => handleInputChange('document', e.target.value)}
                color={errors.document ? 'danger' : 'default'}
                errorMessage={errors.document}
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

              {/* Contraseñas (opcionales para edición) */}
              <Input
                type="password"
                label="Nueva Contraseña"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                color={errors.password ? 'danger' : 'default'}
                errorMessage={errors.password}
                className="w-full"
              />

              <Input
                type="password"
                label="Confirmar Nueva Contraseña"
                placeholder="Confirme la contraseña"
                value={formData.confirmPassword}
                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                color={errors.confirmPassword ? 'danger' : 'default'}
                errorMessage={errors.confirmPassword}
                className="w-full"
              />

              {/* Datos opcionales */}
              <Input
                type="url"
                label="URL de Imagen"
                placeholder="https://..."
                value={formData.image}
                onChange={e => handleInputChange('image', e.target.value)}
                className="w-full"
              />

              <Input
                type="text"
                label="Dirección"
                placeholder="Ingrese la dirección"
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                className="w-full"
              />

              <Input
                type="text"
                label="Ciudad"
                placeholder="Ingrese la ciudad"
                value={formData.city}
                onChange={e => handleInputChange('city', e.target.value)}
                className="w-full"
              />

              {/* Selector de Rol */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Rol</label>
                <div className="flex gap-2">
                  <Chip
                    color={formData.role === USER_ROLES.CLIENT ? 'success' : 'default'}
                    variant={formData.role === USER_ROLES.CLIENT ? 'solid' : 'bordered'}
                    className={`cursor-pointer ${!currentUser?.isSuperAdmin && 'opacity-50'}`}
                    onClick={() => handleRoleChange(USER_ROLES.CLIENT)}>
                    Cliente
                  </Chip>
                  <Chip
                    color={formData.role === USER_ROLES.ADMIN ? 'danger' : 'default'}
                    variant={formData.role === USER_ROLES.ADMIN ? 'solid' : 'bordered'}
                    className={`cursor-pointer ${!currentUser?.isSuperAdmin && 'opacity-50'}`}
                    onClick={() => (currentUser?.isSuperAdmin ? handleRoleChange(USER_ROLES.ADMIN) : null)}>
                    Administrador
                  </Chip>
                </div>
                {!currentUser?.isSuperAdmin && <span className="text-xs text-gray-500 mt-1">Solo el superadmin puede modificar roles</span>}
                {errors.role && <span className="text-danger text-xs">{errors.role}</span>}
              </div>
            </div>

            {apiError && <div className="mt-4 text-danger text-sm">{apiError}</div>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleClose} disabled={isLoading}>
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
