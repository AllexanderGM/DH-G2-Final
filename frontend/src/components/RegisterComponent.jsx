import { Button, Input, Card, Image } from '@heroui/react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import imgLg from '../assets/Backgrounds/walkingman.jpg'

import BrandButton from './BrandButton.jsx'

const RegisterComponent = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/

  const handlePasswordChange = e => {
    const value = e.target.value
    setPassword(value)
    if (!passwordRegex.test(value)) {
      setError('La contraseña debe tener al menos 12 caracteres, un número, un carácter especial y una mayúscula.')
    } else {
      setError('')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center bg-no-repeat bg-fixed">
      <Card className="flex flex-row w-[700px] overflow-hidden h-[500px]">
        <div className="w-1/2 h-full relative flex">
          <img src={imgLg} alt="Register" className="w-full h-full min-h-full object-cover justify-center" />
        </div>

        <div className="w-1/2 p-6 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Crear Cuenta</h2>
          <form>
            <Input
              isRequired
              label="Nombre"
              labelPlacement="outside"
              name="nombre"
              placeholder="Ingresa tu nombre"
              type="text"
              className="mb-4"
            />
            <Input
              isRequired
              label="Apellido"
              labelPlacement="outside"
              name="apellido"
              placeholder="Ingresa tu apellido"
              type="text"
              className="mb-4"
            />
            <Input
              isRequired
              errorMessage={({ validationDetails, validationErrors }) => {
                if (validationDetails.typeMismatch) {
                  return 'Please enter a valid email address'
                }

                return validationErrors
              }}
              label="Correo Electrónico"
              labelPlacement="outside"
              name="email"
              placeholder="correo@ejemplo.com"
              type="email"
              className="mb-4"
            />
            <div className="mb-4">
              <Input
                isRequired
                type="password"
                label="Contraseña"
                labelPlacement="outside"
                placeholder="********"
                value={password}
                onChange={handlePasswordChange}
                className="mb-4"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Input isRequired label="Pais" labelPlacement="outside" name="pais" placeholder="Pais" type="text" className="mb-4" />
            <BrandButton variant="solid" color="brandColor" className="w-full">
              Registrarse
            </BrandButton>
          </form>
          <p className="text-sm text-gray-600 text-center mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link to="/log" className="text-primary-500 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default RegisterComponent
