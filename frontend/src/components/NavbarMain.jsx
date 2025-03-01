import { useState } from 'react'
import { Navbar, NavbarBrand, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, NavbarContent, NavbarItem, Link, Image } from '@heroui/react'

import img from '../assets/Logo/logo_navbar/svg/isotipo_sm.svg'
import NavbarRegularPortion from './NavbarRegularPortion.jsx'
import NavbarAdminPortion from './NavbarAdminPortion.jsx'
import NavbarUserPortion from './NavbarUserPortion.jsx'

function NavbarMain({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuItems = ['Somos', 'Tours', 'Contacto']

  // Iniciales de usuario
  const getInitials = name => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  /*Primera parte es de Web, la segunda parte es Mobil*/
  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        wrapper: 'max-w-6xl mx-auto'
      }}>
      <NavbarBrand>
        <Link href="/" className="text-black">
          <Image alt="Glocal Tour isotipo" className="mr-2" src={img} width="20" radius="none" />
          <p className="font-bold text-inherit">Glocal Tour</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex  gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" className="sm:text-sm md:text-base hover:text-red-600" href="#">
            Somos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" className="hover:text-red-600 sm:text-sm md:text-base" href="#">
            Tours
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" className="hover:text-red-600 sm:text-sm md:text-base" href="#">
            Contacto
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {user?.isAdmin && <NavbarAdminPortion getInitials={getInitials} user={user} />}
        {user?.isAuthenticated && !user?.isAdmin && <NavbarUserPortion getInitials={getInitials} user={user} />}
        {!user?.isAuthenticated && !user?.isAdmin && <NavbarRegularPortion />}
      </NavbarContent>

      <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="sm:hidden" />
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
