import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Navbar as NavbarUi,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarContent,
  NavbarItem,
  Image,
  Button
} from '@heroui/react'
import img from '@assets/Logo/logo_navbar/svg/isotipo_sm.svg'

const menuItems = ['Somos', 'Tours', 'Contacto']

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <NavbarUi isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{ wrapper: 'max-w-6xl mx-auto' }}>
      {/* Marca y Logo */}
      <NavbarBrand>
        <a href="/" className="flex text-black">
          <Image alt="Glocal Tour isotipo" className="mr-2" src={img} width="20" radius="none" />
          <p className="font-bold text-inherit">Glocal Tour</p>
        </a>
      </NavbarBrand>

      {/* Menú principal en pantallas grandes */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <Link className="sm:text-sm md:text-base hover:text-red-600" to="#">
              {item}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Sección de usuario */}
      <NavbarContent justify="end">
        <NavbarItem className="lg:flex text-sm">
          <Link to="/register" className="text-sm md:text-base">
            Crear Cuenta
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button color="primary" className="text-sm md:text-base">
            <Link to="/login" className="text-sm md:text-base w-full h-full flex items-center justify-center">
              Iniciar sesión
            </Link>
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Menú hamburguesa en móviles */}
      <NavbarMenuToggle aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} className="sm:hidden" />
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link className="w-full" to="#">
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NavbarUi>
  )
}

export default Navbar
