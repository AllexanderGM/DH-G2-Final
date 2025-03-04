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
  const response = await axios.get(`${API_URL}/users?email=${email}`)

  if (response.data.length === 0) {
    throw new Error('Usuario no encontrado')
  }

  const user = response.data[0]

  if (user.password !== password) {
    throw new Error('Contraseña incorrecta')
  }

  // Crea un objeto con info de usuario sin password
  const authenticatedUser = {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    avatar: user.avatar,
    role: user.role || 'user',
    isAdmin: user.role === 'admin'
  }

  // Generate a token
  const token = generateToken(user)

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
  // Comprueba si usuario con email existe
  const checkResponse = await axios.get(`${API_URL}/users?email=${userData.email}`)

  if (checkResponse.data.length > 0) {
    throw new Error('Este correo ya está registrado')
  }

  // Setea el rol por defecto (a usuario)
  const userDataWithRole = {
    ...userData,
    role: userData.role || 'user'
  }
  // Crea nuevo usuario
  const response = await axios.post(`${API_URL}/users`, userDataWithRole)

  // Generate token
  const token = generateToken(response.data)

  const authenticatedUser = {
    id: response.data.id,
    email: response.data.email,
    nombre: response.data.nombre,
    apellido: response.data.apellido,
    avatar: response.data.avatar || 'https://i.pravatar.cc/150?u=' + Math.random(),
    role: response.data.role || 'user',
    isAdmin: response.data.role === 'admin'
  }

  // Store token in cookie
  cookies.set('auth_token', token, { path: '/', maxAge: 86400 })

  localStorage.setItem('user', JSON.stringify(authenticatedUser))

  return { user: authenticatedUser, token }
}
