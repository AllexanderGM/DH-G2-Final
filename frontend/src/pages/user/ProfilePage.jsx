import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Avatar, Divider } from '@heroui/react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext.jsx'

const ProfilePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">Cargando perfil...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardBody>
            <div className="text-center">
              <p className="text-xl text-red-600">No se ha encontrado información del usuario</p>
              <p className="mt-2">Por favor, inicia sesión para ver tu perfil</p>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center 9-full min-h-screen bg-gray-100 py-10 px-4">
      <Card className="max-w-xl w-full p-5">
        <CardHeader className="flex flex-col items-center pb-0">
          <Avatar src={user.avatar} size="lg" isBordered color={user.isAdmin ? 'danger' : 'primary'} className="w-20 h-20 text-large" />
          <h1 className="text-2xl font-bold mt-4">
            {user.nombre} {user.apellido}
          </h1>
          <p className="text-gray-500">{user.email}</p>
          <div className="mt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
              {user.role === 'admin' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </CardHeader>

        <CardBody className="py-8">
          <Divider className="my-4" />

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Información Personal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">ID de Usuario</p>
                  <p>{user.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="capitalize">{user.estado || 'No especificado'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">País</p>
                  <p>{user.pais || 'No especificado'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Edad</p>
                  <p>{user.age || 'No especificada'}</p>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            <div>
              <h2 className="text-lg font-semibold mb-2">Seguridad</h2>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Última actualización</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                className="px-4 py-2 bg-[#E86C6E] text-white rounded hover:bg-[#D45C5E] transition-colors"
                onClick={() => navigate('/edit-profile')}>
                Editar Perfil
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default ProfilePage
