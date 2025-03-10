import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie'

import { getCurrentUser, isAuthenticated, logout } from '../services/authService.js'

const AuthContext = createContext()
const cookies = new Cookies()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Comprueba el registro del usuario cuando la App carga
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    const token = cookies.get('auth_token')

    fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      Authorization: `Bearer ${token}`,
      headers: {
        'Content-Type': 'application'
      }
    }).then(response => {
      if (response.ok) {
        logout()
        setUser(null)
        navigate('/login')
      }
    })
  }

  // Comprueba rol
  const checkRole = requiredRole => {
    if (!user) return false

    if (requiredRole === 'admin') {
      return user.isAdmin === true || user.role === 'admin'
    }

    return true
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout: handleLogout, isAdmin: user?.isAdmin || false, hasRole: checkRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
