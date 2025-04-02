import { NavbarItem, Link as HeroLink } from '@heroui/react'
import BrandButton from '@components/BrandButton.jsx'

const NavbarRegularPortion = () => {
  return (
    <>
      <NavbarItem className="lg:flex text-sm">
        <HeroLink className="text-sm md:text-base" href="/register">
          Crear Cuenta
        </HeroLink>
      </NavbarItem>

      <NavbarItem>
        <HeroLink className="text-sm md:text-base" href="/login">
          <BrandButton color="brandColor" className="text-sm md:text-base">
            Iniciar sesión
          </BrandButton>
        </HeroLink>
      </NavbarItem>
    </>
  )
}

export default NavbarRegularPortion
