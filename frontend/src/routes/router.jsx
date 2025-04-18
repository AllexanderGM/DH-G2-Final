import { createBrowserRouter } from 'react-router-dom'
import DynamicLayout from '@layouts/DynamicLayout.jsx'
import HomePage from '@pages/home/Home.jsx'
import DetalleTour from '@pages/tourDetail/DetalleTour.jsx'
import NotFoundPage from '@pages/notFound/NotFoundPage.jsx'
import IniciarSesion from '@pages/login/IniciarSesion.jsx'
import RegistrarUsuario from '@pages/register/RegistrarUsuario.jsx'
import AdminPage from '@pages/admin/AdminPage.jsx'
import ProfilePage from '@pages/user/ProfilePage.jsx'
import EditUserProfile from '@pages/userEdit/EditUserProfile.jsx'
import FavoritesPage from '@pages/favorites/FavoritesPage.jsx'
import BookingHistoryPage from '@pages/bookingHistory/BookingHistoryPage.jsx'
import Users from '@components/Users.jsx'
import ConfirmReserv from '@pages/confirmReservation/ConfirmReserv.jsx'
import CategoryPage from '@pages/category/CategoryPage.jsx'
import AboutPage from '@pages/about/AboutPage.jsx'
import ToursPage from '@pages/tours/ToursPage.jsx'
import ContactPage from '@pages/contact/ContactPage.jsx'

import RequireAuth from './RequireAuth.jsx'
import App from './App.jsx'

import '@styles/tailwind.css'
import '@styles/global.scss'

// Crear el router con todas las rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '',
        element: <DynamicLayout />,
        children: [
          // Rutas públicas
          { index: true, element: <HomePage /> },
          { path: 'tour/:id', element: <DetalleTour /> },
          { path: 'login', element: <IniciarSesion /> },
          { path: 'register', element: <RegistrarUsuario /> },
          { path: 'users', element: <Users /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'tours', element: <ToursPage /> },
          { path: 'contacto', element: <ContactPage /> },
          {
            path: 'tour/:id/confirm',
            element: (
              <RequireAuth>
                <ConfirmReserv />
              </RequireAuth>
            )
          },

          // Nueva ruta para categorías
          { path: 'categoria/:categoryName', element: <CategoryPage /> },

          // Rutas protegidas para clientes
          {
            path: 'favoritos',
            element: (
              <RequireAuth>
                <FavoritesPage />
              </RequireAuth>
            )
          },
          {
            path: 'profile-user',
            element: (
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            )
          },
          {
            path: 'edit-profile',
            element: (
              <RequireAuth>
                <EditUserProfile />
              </RequireAuth>
            )
          },
          {
            path: 'mis-reservas',
            element: (
              <RequireAuth>
                <BookingHistoryPage />
              </RequireAuth>
            )
          },

          // Rutas protegidas para administradores
          {
            path: 'admin',
            element: (
              <RequireAuth requiredRole="admin">
                <AdminPage />
              </RequireAuth>
            )
          },
          {
            path: 'profile-admin',
            element: (
              <RequireAuth requiredRole="admin">
                <ProfilePage />
              </RequireAuth>
            )
          }
        ]
      }
    ]
  }
])

export default router
