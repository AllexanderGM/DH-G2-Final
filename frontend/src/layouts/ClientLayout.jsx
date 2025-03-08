import { Outlet } from 'react-router-dom'
import NavbarClient from '@components/layout/NavbarClient'
import Footer from '@components/layout/Footer'

const ClientLayout = () => {
  return (
    <>
      <NavbarClient />
      <Outlet />
      <Footer />
    </>
  )
}

export default ClientLayout
