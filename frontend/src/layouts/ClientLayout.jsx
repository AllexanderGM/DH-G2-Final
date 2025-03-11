import { Outlet } from 'react-router-dom'
import Footer from '@components/layout/Footer'
import Navbar from '@components/layout/Navbar'

const ClientLayout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default ClientLayout
