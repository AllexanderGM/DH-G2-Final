import axios from 'axios'
import { Cookies } from 'react-cookie'

const API_URL = 'http://localhost:8000'
const cookies = new Cookies()

// Simula generación de JWT
const generateToken = user => {
  return `simulated-jwt-token-${user.id}-${user.role}-${Date.now()}`
}

export const login = async (email, password) => {
  // Obtener usuario por email
  const configFetch = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  }

  const data = await fetch('http://localhost:8080/auth/login', configFetch)
  const result = await data.json()

  const authenticatedUser = {
    id: result.id,
    email: result.email,
    nombre: result.name,
    apellido: result.lastName,
    avatar: result.image,
    role: result.role || 'user',
    isAdmin: result.role === 'admin'
  }

  // Generate a token
  const token = result.token

  // Store the token in a cookie (httpOnly would be better but requires a real backend)
  cookies.set('auth_token', token, { path: '/', maxAge: 86400 }) // 24 horas

  // Store user info in localStorage (in a real app with proper JWT, you might not need this)
  localStorage.setItem('user', JSON.stringify(authenticatedUser))

  return { user: authenticatedUser, token }
}

export const logout = () => {
  cookies.remove('auth_token', { path: '/' })
  localStorage.removeItem('user')
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null

  // Comprueba si el token existe
  const token = cookies.get('auth_token')
  if (!token) {
    localStorage.removeItem('user')
    return null
  }

  const user = JSON.parse(userStr)

  user.isAuthenticated = true

  return user
}

export const isAuthenticated = () => {
  return cookies.get('auth_token') !== undefined
}

export const hasRole = requiredRole => {
  const user = getCurrentUser()
  if (!user) return false

  if (requiredRole === 'admin') {
    return user.isAdmin === true || user.role === 'admin'
  }

  return true
}

export const register = async userData => {
  // Setea el rol por defecto (a usuario)
  const newUser = {
    image: userData.avatar,
    name: userData.nombre,
    lastName: userData.apellido,
    document: '123456789',
    phone: '300123456',
    dateOfBirth: '1990-05-15',
    email: userData.email,
    password: userData.password,
    address: 'Calle 123 #45-67',
    city: 'Bogotá'
  }

  const fetchConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  }

  const data = await fetch('http://localhost:8080/auth/register', fetchConfig)
  const result = await data.json()

  return result.message
}
