import { Form, Input, Button, Card, CardBody, Image, form } from '@heroui/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register } from '../services/authService.js'
import walkingmanImage from '../assets/Backgrounds/walkingman.webp'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')

  // const [password, setPassword] = useState('')
  // const [isInvalid, setIsInvalid] = useState(false)
  // const [errorMessage, setErrorMessage] = useState('')
  // const [submitted, setSubmitted] = useState(null)

  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.nombre) {
      newErrors.nombre = 'Por favor. Ingresa tu nombre'
    }
    if (!formData.apellido) {
      newErrors.apellido = 'Por favor. Ingresa tu apellido'
    }

    if (!formData.email) {
      newErrors.email = 'Por favor. Ingresa tu correo electrónico'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido'
    }

    if (!formData.password) {
      newErrors.password = 'Por favor ingresa una contraseña'
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener 8 caracteres o más'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    return newErrors
  }

  // const getPasswordError = value => {
  //   if (value.length < 8) {
  //     return 'La contraseña debe tener 8 caracteres o más'
  //   }
  //   if ((value.match(/[A-Z]/g) || []).length < 1) {
  //     return 'La contraseña debe tener al menos una letra mayúscula'
  //   }
  //   if ((value.match(/[^a-z]/gi) || []).length < 1) {
  //     return 'La contraseña debe tener al menos un caracter especial'
  //   }
  //
  //   return null
  // }

  // const handlePasswordChange = value => {
  //   setPassword(value)
  //   const error = getPasswordError(value)
  //   setIsInvalid(!!error)
  //   setErrorMessage(error)
  // }

  const onSubmit = async e => {
    e.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setRegisterError('')
    setIsLoading(true)

    try {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        estado: 'activo',
        pais: 'No especificado',
        age: null,
        avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
      }

      const result = await register(userData)
      console.log('Registro exitoso', result)

      navigate('/')
    } catch (error) {
      console.log('Registro fallido', error)
      setRegisterError(error.message || 'Error al registrarse. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setErrors({})
    setRegisterError('')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-8">
      <Card className="w-[800px] h-full md:h-[750px] md:max-h-[830px] overflow-hidden">
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-1 p-0">
          <div className="h-full flex items-end justify-end">
            <Image
              removeWrapper
              src={walkingmanImage}
              alt="Un hombre mirando el horizonte sobre un bosque montañoso"
              className="w-full h-full object-cover object-[13%_center] rounded-none"
            />
          </div>

          <Form
            className="w-full justify-center items-center space-y-3 py-0"
            validationErrors={errors}
            onReset={handleReset}
            onSubmit={onSubmit}>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Crear Cuenta</h2>

            {registerError && <div className="bg-red-100 text-red-700 p-3 rounded-md max-w-md w-full mx-12">{registerError}</div>}

            <div className="flex flex-col gap-5 max-w-md w-full px-12">
              <Input
                isRequired
                errorMessage={errors.nombre}
                isInvalid={!!errors.nombre}
                label="Nombre"
                labelPlacement="outside"
                name="name"
                placeholder="Ingresa tu nombre"
                value={formData.nombre}
                onValueChange={value => handleChange('nombre', value)}
              />
              <Input
                isRequired
                errorMessage={errors.apellido}
                isInvalid={!!errors.apellido}
                label="Apellido"
                labelPlacement="outside"
                name="lastname"
                placeholder="Ingresa tu apellido"
                value={formData.apellido}
                onValueChange={value => handleChange('apellido', value)}
              />
              <Input
                isRequired
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="correo@ejemplo.com"
                type="email"
                value={formData.email}
                onValueChange={value => handleChange('email', value)}
              />
              <Input
                isRequired
                errorMessage={errors.password}
                isInvalid={!!errors.password}
                label="Contraseña"
                labelPlacement="outside"
                name="password"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={formData.password}
                onValueChange={value => handleChange('password', value)}
              />

              <Input
                isRequired
                errorMessage={errors.confirmPassword}
                isInvalid={!!errors.confirmPassword}
                label="Confirmar contraseña"
                labelPlacement="outside"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                type="password"
                value={formData.confirmPassword}
                onValueChange={value => handleChange('confirmPassword', value)}
              />

              <div className="flex gap-4 mt-2">
                <Button className="w-full bg-[#E86C6E]" color="primary" type="submit" isLoading={isLoading} disabled={isLoading}>
                  {isLoading ? 'Procesando...' : 'Registrarse'}
                </Button>
                <Button type="reset" variant="bordered" disabled={isLoading}>
                  Reset
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary-500 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default RegisterForm
