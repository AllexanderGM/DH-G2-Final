import { Outlet } from 'react-router-dom'
import NavbarModel from '@components/NavbarModel'

function App() {
  return (
    <>
      <NavbarModel />
      <Outlet />
    </>
  )
}

export default App
