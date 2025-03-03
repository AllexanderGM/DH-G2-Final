import { Form, Input, Button, Card, CardBody, Image } from '@heroui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import forestmanImage from '../assets/Backgrounds/forestman.webp'

const LoginForm = () => {
  const [password, setPassword] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [errors, setErrors] = useState({})

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

  const onSubmit = e => {
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
    setSubmitted(data)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 -mt-8">
      <Card className="w-[700px] h-full md:h-[550px] overflow-hidden rounded-none md:rounded-xl">
        <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-1 p-0 ">
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
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Iniciar sesión</h2>
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
              />

              <div className="flex gap-4">
                <Button className="w-full bg-[#E86C6E]" color="primary" type="submit">
                  Iniciar sesión
                </Button>
                <Button type="reset" variant="bordered">
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
