import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, CardBody, Image } from '@heroui/react'

import { login } from '../services/authService.js'
import forestmanImage from '../assets/Backgrounds/forestman.jpg'
import { useAuth } from '../context/AuthContext.jsx'

const LoginForm = () => {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    let redirectTimer
    if (loginSuccess) {
      redirectTimer = setTimeout(() => {
        navigate('/')
      }, 1000)
    }
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer)
    }
  }, [loginSuccess, navigate])

  const getPasswordError = value => {
    if (!value) {
      return 'Por favor, ingresa tu contraseña'
    }
    if (value.length < 8) {
      return 'La contraseña debe tener 8 caracteres o más'
    }
    return null
  }

  const handlePasswordChange = value => {
    setPassword(value)
    const error = getPasswordError(value)
    setIsInvalid(!!error)
    setErrorMessage(error)
  }

  const handleEmailChange = value => {
    setEmail(value)
    if (errors.email) {
      const newErrors = { ...errors }
      delete newErrors.email
      setErrors(newErrors)
    }
  }

  const onSubmit = async e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))

    // Custom validation checks
    const newErrors = {}

    if (!data.email) {
      newErrors.email = 'Por favor. Ingresa tu correo electrónico'
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido'
    }

    // Password validation
    const passwordError = getPasswordError(data.password)

    if (passwordError) {
      newErrors.password = passwordError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)

      return
    }

    // Clear errors and submit
    setErrors({})
    setLoginError('')
    setSubmitted(data)
    setIsLoading(true)

    try {
      const result = await login(data.email, data.password)
      console.log('Login exitoso', result)

      setUser(result.user)
      setLoginSuccess(true)
    } catch (error) {
      console.error('Login failed:', error)
      setLoginError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setEmail('')
    setPassword('')
    setErrors({})
    setLoginError('')
    setIsInvalid(false)
    setErrorMessage('')
    setLoginSuccess(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 -mt-8">
      <Card className="w-[700px] h-full md:h-[550px] overflow-hidden rounded-none md:rounded-xl">
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-0 p-0 ">
          <div className="h-full relative flex">
            <Image
              src={forestmanImage}
              alt="Un hombre mirando el horizonte sobre un bosque montañoso"
              className="w-full h-full min-h-full object-cover rounded-none"
            />
          </div>

          <Form
            className="w-full flex flex-col justify-center items-center space-y-3 py-12 md:py-2"
            validationErrors={errors}
            onReset={handleReset}
            onSubmit={onSubmit}>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Iniciar sesión</h2>

            {loginError && <div className="bg-red-100 text-red-700 p-3 rounded-none max-w-md w-full mx-12">{loginError}</div>}

            {loginSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded-md max-w-md w-full mx-12">
                ¡Inicio de sesión exitoso! Redireccionando...
              </div>
            )}

            <div className="flex flex-col gap-5 max-w-md w-full px-12 py-0">
              <Input
                isRequired
                errorMessage={errors.email}
                isInvalid={!!errors.email}
                label="Correo electrónico"
                labelPlacement="outside"
                name="email"
                placeholder="correo@ejemplo.com"
                type="email"
                onValueChange={handleEmailChange}
                value={email}
                disabled={loginSuccess}
              />
              <Input
                isRequired
                errorMessage={errorMessage}
                isInvalid={isInvalid}
                label="Contraseña"
                labelPlacement="outside"
                name="password"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={password}
                onValueChange={handlePasswordChange}
                disabled={loginSuccess}
              />

              <div className="flex gap-4">
                <Button
                  className="w-full bg-[#E86C6E]"
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading || loginSuccess}>
                  {isLoading ? 'Procesando...' : 'Iniciar sesión'}
                </Button>
                <Button type="reset" variant="bordered" disabled={isLoading || loginSuccess}>
                  Reset
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center mt-4">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-500 hover:underline">
                Registrate aquí
              </Link>
            </p>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default LoginForm
