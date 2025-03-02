import { NavbarItem, Link } from '@heroui/react'

import BrandButton from './BrandButton.jsx'

const NavbarRegularPortion = () => {
  return (
    <>
      <NavbarItem className="lg:flex text-sm">
        <Link className="text-sm md:text-base" href="/register">
          Crear Cuenta
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
