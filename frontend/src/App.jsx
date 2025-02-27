import { Outlet } from 'react-router-dom'
import NavbarMain from '@components/NavbarMain'
import FooterMain from '@components/FooterMain'
import { useState } from 'react'

function App() {
  const [user, setUser] = useState({
    name: 'Javier Ascevedo',
    isAdmin: true,
    isAuthenticated: true
  })

  return (
    <>
      <NavbarMain user={user} />
      <Outlet />
      <FooterMain />
    </>
  )
}

export default App
