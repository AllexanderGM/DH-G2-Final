import { Outlet } from 'react-router-dom'
import NavbarMain from '@components/NavbarMain'
import Footer from '@components/Footer'

function App() {
  return (
    <>
      <NavbarMain />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
