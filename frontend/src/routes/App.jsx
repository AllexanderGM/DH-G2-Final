import { Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CookiesProvider } from 'react-cookie'
import { AuthProvider } from '@context/AuthContext.jsx'
import { FavoritesProvider } from '@context/FavoritesContext.jsx'
import GeneralContext from '@context/GeneralContext.jsx'
import '@styles/tailwind.css'
import '@styles/global.scss'

function App() {
  return (
    <HelmetProvider>
      <CookiesProvider>
        <AuthProvider>
          <FavoritesProvider>
            <GeneralContext>
              <Outlet />
            </GeneralContext>
          </FavoritesProvider>
        </AuthProvider>
      </CookiesProvider>
    </HelmetProvider>
  )
}

export default App
