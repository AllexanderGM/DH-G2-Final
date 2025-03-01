import { Link } from 'react-router-dom'
import { NavbarItem } from '@heroui/react'

import BrandButton from './BrandButton.jsx'

const NavbarRegularPortion = () => {
  return (
    <>
      <NavbarItem className="lg:flex text-sm">
        <Link className="text-sm md:text-base" href="/register">
          Registrarse
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link className="text-sm md:text-base" href="/log">
          <BrandButton color="brandColor" className="text-sm md:text-base">
            Iniciar sesión
          </BrandButton>
        </Link>
      </NavbarItem>
    </>
  )
}

export default NavbarRegularPortion
