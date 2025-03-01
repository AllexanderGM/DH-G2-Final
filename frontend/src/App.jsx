import { Outlet } from 'react-router-dom'
import NavbarMain from '@components/NavbarMain'
import FooterMain from '@components/FooterMain'

import GeneralContext from './context/GeneralContext.jsx'

function App() {
  const user = {
    name: 'Javier Ascevedo',
    isAdmin: false,
    isAuthenticated: true
  }

  return (
    <>
      <GeneralContext>
        <NavbarMain user={user} />
        <Outlet />
        <FooterMain />
      </GeneralContext>
    </>
  )
}

export default App
