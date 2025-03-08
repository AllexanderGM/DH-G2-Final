import { useAuth } from '@context/AuthContext'

import Layout from './Layout.jsx'
import ClientLayout from './ClientLayout.jsx'
import AdminLayout from './AdminLayout.jsx'

const DynamicLayout = () => {
  const { user } = useAuth()

  if (!user || !user.role) return <Layout />

  const layoutOptions = {
    ADMIN: <AdminLayout />,
    CLIENT: <ClientLayout />
  }

  return layoutOptions[user.role] || <Layout />
}

export default DynamicLayout
