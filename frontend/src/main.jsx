import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import DetalleTour from './pages/DetalleTour.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import IniciarSesion from './pages/IniciarSesion.jsx'
import RegistrarUsuario from './pages/RegistrarUsuario.jsx'

import GeneralContext from './context/GeneralContext.jsx'
import App from './App.jsx'

// Estilos con Tailwind CSS
import './styles/tailwind.css'
// Estilos generales Styles
import './styles/global.scss'

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
        path: '/log',
        element: <IniciarSesion />
      },
      {
        path: '/register',
        element: <RegistrarUsuario />
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
