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

  const isUserAdmin = userObj => {
    if (!userObj) return false

    return userObj.isAdmin === true || userObj.role === 'admin' || userObj.role === 'ADMIN'
  }

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      } else {
        setUser(null) // Asegurar que user sea null cuando no hay autenticación
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    const token = cookies.get('auth_token')

    fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          logout()
          setUser(null)
          navigate('/')
        } else {
          console.error('Logout failed on server, but proceeding with local logout')
          logout()
          setUser(null)
          navigate('/')
        }
      })
      .catch(error => {
        console.error('Error durante el logout:', error)
        logout()
        setUser(null)
        navigate('/')
      })
  }

  const checkRole = requiredRole => {
    if (!user) return false

    if (requiredRole === 'admin') {
      return isUserAdmin(user)
    }

    return true
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout: handleLogout, isAdmin: isUserAdmin(user), hasRole: checkRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
