import { Outlet } from 'react-router-dom'
import NavbarMain from '@components/NavbarMain'
import FooterMain from '@components/FooterMain'

function App() {
  return (
    <>
      <NavbarMain />
      <Outlet />
      <FooterMain />
    </>
  )
}

export default App
