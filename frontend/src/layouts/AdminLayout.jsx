import { Outlet } from 'react-router-dom'
import NavbarAdminPortion from '@components/layout/NavbarAdmin'
import Footer from '@components/layout/Footer'

const AdminLayout = () => {
  return (
    <>
      <NavbarAdminPortion />
      <Outlet />
      <Footer />
    </>
  )
}

export default AdminLayout
