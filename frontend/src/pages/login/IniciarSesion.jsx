import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext.jsx'
import LoginForm from '@components/LoginForm.jsx'

const IniciarSesion = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loginMessage, setLoginMessage] = useState('')

  // Capturar mensaje de redirección si existe
  useEffect(() => {
    if (location.state?.message) {
      setLoginMessage(location.state.message)
    }
  }, [location])

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      // Redirigir a la página anterior o al inicio
      const redirectTo = location.state?.from || '/'
      navigate(redirectTo, { replace: true })
    }
  }, [user, navigate, location])

  return (
    <div>
      <LoginForm loginMessage={loginMessage} />
    </div>
  )
}

export default IniciarSesion
