import { Outlet } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import { AuthProvider } from '@context/AuthContext.jsx'
import GeneralContext from '@context/GeneralContext.jsx'
import '@styles/tailwind.css'
import '@styles/global.scss'

function App() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <GeneralContext>
          <Outlet />
        </GeneralContext>
      </AuthProvider>
    </CookiesProvider>
  )
}

export default App
