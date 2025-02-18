import { Navbar, NavbarBrand, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, NavbarContent, NavbarItem, Link, Image } from '@heroui/react'

import BrandButton from './BrandButton.jsx'
import img from '../assets/Logo/logo_navbar/svg/isotipo_sm.svg'

function NavbarMain() {
  const menuItems = ['Lugares', 'Guias', 'Blog', 'Crear Usuario', 'Iniciar Sesion']

  /*Primera parte es de Web, la segunda parte es Mobil*/
  return (
    <Navbar
      classNames={{
        wrapper: 'max-w-6xl mx-auto'
      }}>
      <NavbarBrand>
        <Link href="/" className="text-black">
          <Image alt="Glocal Tour isotipo" className="mr-2" src={img} width="20" radius="none" />
          <p className="font-bold text-inherit">Glocal Tour</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Somos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Tours
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Contacto
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Crear usuario</Link>
        </NavbarItem>
        <NavbarItem>
          <BrandButton color="brandColor">Iniciar sesión</BrandButton>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" href="#" size="lg">
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default NavbarMain
