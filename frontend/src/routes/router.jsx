import { createBrowserRouter } from 'react-router-dom'
import DynamicLayout from '@layouts/DynamicLayout.jsx'
import HomePage from '@pages/home/Home.jsx'
import DetalleTour from '@pages/tourDetail/DetalleTour.jsx'
import NotFoundPage from '@pages/notFound/NotFoundPage.jsx'
import IniciarSesion from '@pages/login/IniciarSesion.jsx'
import RegistrarUsuario from '@pages/register/RegistrarUsuario.jsx'
import AdminPage from '@pages/admin/AdminPage.jsx'
import CrearTour from '@pages/tourCreate/CrearTour.jsx'
import ProfilePage from '@pages/user/ProfilePage.jsx'
import EditUserProfile from '@pages/userEdit/EditUserProfile.jsx'
import FavoritesPage from '@pages/favorites/FavoritesPage.jsx'
import Users from '@components/Users.jsx'

import App from './App.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import '@styles/tailwind.css'
import '@styles/global.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      // Rutas públicas
      {
        path: '/',
        element: <DynamicLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/tour/:id', element: <DetalleTour /> },
          { path: '/favoritos', element: <FavoritesPage /> },
          { path: '/users', element: <Users /> },
          {
            path: '/login',
            element: <IniciarSesion />
          },
          {
            path: '/register',
            element: <RegistrarUsuario />
          }
        ]
      },
      // Rutas protegidas para usuarios
      {
        path: '',
        element: <ProtectedRoute requiredRole="user" />,
        children: [
          { path: '/profile-user', element: <ProfilePage /> },
          { path: '/edit-profile', element: <EditUserProfile /> }
        ]
      },
      // Rutas protegidas para administradores
      {
        path: '',
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          { path: '/admin', element: <AdminPage /> },
          { path: '/crear-tour', element: <CrearTour /> },
          { path: '/profile-admin', element: <ProfilePage /> }
        ]
      }
    ]
  }
])

export default router
