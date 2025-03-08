import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, CardBody, CardHeader, Select, SelectItem, Divider } from '@heroui/react'

import { useAuth } from '../context/AuthContext.jsx'

const EditUserProfile = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    estado: '',
    pais: '',
    age: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        estado: user.estado || '',
        pais: user.pais || '',
        age: user.age ? String(user.age) : ''
      })
    }
  }, [user])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const updatedUserData = {
        ...user,
        nombre: formData.nombre,
        apellido: formData.apellido,
        estado: formData.estado,
        pais: formData.pais,
        age: formData.age ? parseInt(formData.age) : null
      }

      // Log ID for debugging
      console.log('User ID type:', typeof user.id, 'Value:', user.id)

      // Ensure ID is handled correctly (no need to convert if already correct type)
      const userId = user.id.toString()

      // First, try PATCH
      let response = await fetch(`http://localhost:8000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUserData)
      })

      // If PATCH fails, try PUT instead
      if (!response.ok) {
        console.log('PATCH failed, trying PUT instead')
        response = await fetch(`http://localhost:8000/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUserData)
        })
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Error al actualizar el perfil: ${response.status}`)
      }

      const data = await response.json()
      setUser(data)
      setSuccess(true)

      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      setError(error.message || 'Ha ocurrido un error al actualizar tu perfil')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardBody>
            <div className="text-center">
              <p className="text-xl text-red-600">No se ha encontrado información del usuario</p>
              <p className="mt-2">Por favor, inicia sesión para editar tu perfil</p>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100">
      <Card className="max-w-xl w-full p-6">
        <CardHeader className="flex flex-col">
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
          <p className="text-gray-500 text-center">Actualiza tu información personal</p>
        </CardHeader>

        <CardBody>
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-md w-full mb-4">{error}</div>}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-md w-full mb-4">
              ¡Perfil actualizado correctamente! Redireccionando...
            </div>
          )}

          <Form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-5">
                <Input
                  label="Nombre"
                  labelPlacement="outside"
                  name="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onValueChange={value => handleChange('nombre', value)}
                  isDisabled={isLoading || success}
                />

                <Input
                  label="Apellido"
                  labelPlacement="outside"
                  name="apellido"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onValueChange={value => handleChange('apellido', value)}
                  isDisabled={isLoading || success}
                />
              </div>
              <Input
                label="Correo electrónico"
                labelPlacement="outside"
                name="email"
                placeholder="correo@ejemplo.com"
                type="email"
                value={formData.email}
                isReadOnly
                description="El correo electrónico no se puede modificar"
                isDisabled={true}
                className="py-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Estado"
                  placeholder="Selecciona un estado"
                  labelPlacement="outside"
                  value={formData.estado}
                  onChange={e => handleChange('estado', e.target.value)}
                  isDisabled={isLoading || success}>
                  <SelectItem key="activo" value="activo">
                    Activo
                  </SelectItem>
                  <SelectItem key="inactivo" value="inactivo">
                    Inactivo
                  </SelectItem>
                </Select>

                <Input
                  label="Edad"
                  labelPlacement="outside"
                  name="age"
                  placeholder="Tu edad"
                  type="number"
                  value={formData.age}
                  onValueChange={value => handleChange('age', value)}
                  isDisabled={isLoading || success}
                />
              </div>

              <Input
                label="País"
                labelPlacement="outside"
                name="pais"
                placeholder="Tu país"
                value={formData.pais}
                onValueChange={value => handleChange('pais', value)}
                isDisabled={isLoading || success}
                className="py-4"
              />
            </div>

            <Divider className="my-4" />

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="bordered" onPress={() => navigate('/profile')} isDisabled={isLoading || success}>
                Cancelar
              </Button>
              <Button type="submit" color="primary" className="bg-[#E86C6E]" isLoading={isLoading} isDisabled={success}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default EditUserProfile
