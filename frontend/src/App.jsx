import { Outlet } from 'react-router-dom'
import NavbarMain from '@components/NavbarMain'
import FooterMain from '@components/FooterMain'
import { useState } from 'react'
import GeneralContext from './context/GeneralContext'

function App() {
  const [user, setUser] = useState({
    name: 'Javier Ascevedo',
    isAdmin: false,
    isAuthenticated: true
  })

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
