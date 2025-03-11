import { useAuth } from '@context/AuthContext'

import AdminLayout from './AdminLayout.jsx'
import ClientLayout from './ClientLayout.jsx'
import Layout from './Layout.jsx'

const DynamicLayout = () => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center justify-center flex-grow">
          <div className="text-center">
            <p className="text-xl">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (user && isAdmin) {
    return <AdminLayout />
  }

  if (user) {
    return <ClientLayout />
  }

  return <Layout />
}

export default DynamicLayout
