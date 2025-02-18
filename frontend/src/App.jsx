import { Outlet } from 'react-router-dom'
import NavbarMain from '@components/NavbarMain'

function App() {
  return (
    <>
      <NavbarMain />
      <Outlet />
    </>
  )
}

export default App
