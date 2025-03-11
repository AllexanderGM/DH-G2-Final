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
  Image
} from '@heroui/react'
import { useAuth } from '@context/AuthContext.jsx'
import img from '@assets/Logo/logo_navbar/svg/isotipo_sm.svg'

import NavbarRegularPortion from './NavbarRegularPortion.jsx'
import NavbarClientPortion from './NavbarClientPortion.jsx'
import NavbarAdminPortion from './NavbarAdminPortion.jsx'

const menuItems = ['Somos', 'Tours', 'Contacto']

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useAuth()
  const { name, lastName, email, avatar, role } = user

  const roleOptions = {
    CLIENT: <NavbarClientPortion avatar={avatar} name={name} lastName={lastName} email={email} />,
    ADMIN: <NavbarAdminPortion avatar={avatar} name={name} lastName={lastName} />
  }

  const dynamicPortion = roleOptions[role] || <NavbarRegularPortion />

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

      {/* Sección de usuario */}
      <NavbarContent justify="end" className="cursor-pointer">
        {dynamicPortion}
      </NavbarContent>
    </NavbarUi>
  )
}

export default Navbar
