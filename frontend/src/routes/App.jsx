import { Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CookiesProvider } from 'react-cookie'
import { AuthProvider } from '@context/AuthContext.jsx'
import { FavoritesProvider } from '@context/FavoritesContext.jsx'
import { SearchProvider } from '@context/SearchContext.jsx'
import GeneralContext from '@context/GeneralContext.jsx'
import '@styles/tailwind.css'
import '@styles/global.scss'

function App() {
  return (
    <HelmetProvider>
      <CookiesProvider>
        <AuthProvider>
          <FavoritesProvider>
            <SearchProvider>
              <GeneralContext>
                <Outlet />
              </GeneralContext>
            </SearchProvider>
          </FavoritesProvider>
        </AuthProvider>
      </CookiesProvider>
    </HelmetProvider>
  )
}

export default App
