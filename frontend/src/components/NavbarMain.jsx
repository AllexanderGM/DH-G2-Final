import { useState, useEffect } from 'react'
import { Navbar, NavbarBrand, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, NavbarContent, NavbarItem, Link, Image } from '@heroui/react'

import { useAuth } from '../context/AuthContext.jsx'
import img from '../assets/Logo/logo_navbar/svg/isotipo_sm.svg'
import NavbarRegularPortion from './NavbarRegularPortion.jsx'
import NavbarAdminPortion from './NavbarAdminPortion.jsx'
import NavbarUserPortion from './NavbarUserPortion.jsx'

function NavbarMain() {
  const { user, loading, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuItems = ['Somos', 'Tours', 'Contacto']

  // debugging
  useEffect(() => {
    console.log('Auth state cambió en el navbar:', user)
  }, [user])

  // Iniciales de usuario
  const getInitials = (nombre, apellido) => {
    if (!nombre) return 'U'

    return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase()
  }

  // No mostrar navbar mientras se checkea autenticación
  if (loading) {
    return null
  }

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
        {!user && <NavbarRegularPortion />}

        {user && user.isAdmin && <NavbarAdminPortion getInitials={getInitials} />}

        {user && !user.isAdmin && <NavbarUserPortion getInitials={getInitials} />}
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
