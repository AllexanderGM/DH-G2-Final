import { Form, Input, Select, SelectItem, Button, Card, CardBody, Image } from '@heroui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import walkingmanImage from '../assets/Backgrounds/walkingman.jpeg'

const RegisterForm = () => {
  const [password, setPassword] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [errors, setErrors] = useState({})

  const getPasswordError = value => {
    if (value.length < 8) {
      return 'La contraseña debe tener 8 caracteres o más'
    }
    if ((value.match(/[A-Z]/g) || []).length < 1) {
      return 'La contraseña debe tener al menos una letra mayúscula'
    }
    if ((value.match(/[^a-z]/gi) || []).length < 1) {
      return 'La contraseña debe tener al menos un caracter especial'
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

    // Username validation
    if (data.name === 'admin') {
      newErrors.name = '¡Buen intento! Choose a different username'
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
      <Card className="w-[800px] h-[630px] overflow-hidden">
        <CardBody className="grid grid-cols-2 gap-1 p-0">
          <div className="h-full flex items-end justify-end">
            <Image
              removeWrapper
              src={walkingmanImage}
              alt="Un hombre mirando el horizonte sobre un bosque montañoso"
              className="w-full h-full object-cover object-[13%_center] rounded-none"
            />
          </div>

          <Form
            className="w-full justify-center items-center space-y-3 py-10"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Crear Cuenta</h2>
            <div className="flex flex-col gap-5 max-w-md w-full px-12">
              <Input
                isRequired
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return 'Please enter your name'
                  }

                  return errors.name
                }}
                label="Nombre"
                labelPlacement="outside"
                name="name"
                placeholder="Ingresa tu nombre"
              />
              <Input
                isRequired
                errorMessage={({ validationDetails }) => {
                  if (validationDetails.valueMissing) {
                    return 'Please enter your name'
                  }

                  return errors.name
                }}
                label="Apellido"
                labelPlacement="outside"
                name="lastname"
                placeholder="Ingresa tu apellido"
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

              <div className="flex gap-4 mt-2">
                <Button className="w-full bg-[#E86C6E]" color="primary" type="submit">
                  Registrarse
                </Button>
                <Button type="reset" variant="bordered">
                  Reset
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              ¿Ya tienes cuenta?{' '}
              <Link to="/log" className="text-primary-500 hover:underline">
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
