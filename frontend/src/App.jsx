import { Outlet } from 'react-router-dom'
import NavbarMain from '@components/NavbarMain'
import Footer from '@components/Footer'
// import FooterMain from '@components/FooterMain'
import { CookiesProvider } from 'react-cookie'

import { AuthProvider } from './context/AuthContext.jsx'
import GeneralContext from './context/GeneralContext.jsx'

function App() {
  return (
    <>
      <CookiesProvider>
        <AuthProvider>
          <GeneralContext>
            <NavbarMain />
            <Outlet />
            <Footer />
          </GeneralContext>
        </AuthProvider>
      </CookiesProvider>
    </>
  )
}

export default App
