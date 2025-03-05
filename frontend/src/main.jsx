import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Users from '@components/Users.jsx'

import HomePage from './pages/HomePage.jsx'
import DetalleTour from './pages/DetalleTour.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import IniciarSesion from './pages/IniciarSesion.jsx'
import RegistrarUsuario from './pages/RegistrarUsuario.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CrearTour from './pages/CrearTour.jsx'
import ProtectedRoute from './pages/ProtectedRoute.jsx'
import App from './App.jsx'
import './styles/tailwind.css'
import './styles/global.scss'
import ProfilePage from './pages/ProfilePage.jsx'
import EditUserProfile from './pages/EditUserProfile.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/tour/:id',
        element: <DetalleTour />
      },
      {
        path: '/login',
        element: <IniciarSesion />
      },
      {
        path: '/register',
        element: <RegistrarUsuario />
      },
      {
        path: '',
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          { path: '/admin', element: <AdminPage /> },
          { path: '/crear-tour', element: <CrearTour /> },
          { path: '/profile-admin', element: <ProfilePage /> }
        ]
      },
      {
        path: '',
        element: <ProtectedRoute requiredRole="user" />,
        children: [
          { path: '/favoritos', element: <FavoritesPage /> },
          { path: '/users', element: <Users /> },
          { path: '/profile-user', element: <ProfilePage /> },
          { path: '/edit-profile', element: <EditUserProfile /> }
        ]
      }
    ],
    errorElement: <NotFoundPage />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
