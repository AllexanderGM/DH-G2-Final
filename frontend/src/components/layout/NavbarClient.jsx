import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, NavbarBrand, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, NavbarContent, NavbarItem, Image } from '@heroui/react'
import { useAuth } from '@context/AuthContext.jsx'
import img from '@assets/Logo/logo_navbar/svg/isotipo_sm.svg'

import NavbarRegularPortion from './NavbarRegularPortion.jsx'
import NavbarAdminPortion from './NavbarAdmin.jsx'
import NavbarUserPortion from './NavbarUserPortion.jsx'

// Función para obtener iniciales del usuario
const getInitials = (name = '', lastName = '') => name.charAt(0).toUpperCase() + (lastName.charAt(0) || '').toUpperCase()

const menuItems = ['Somos', 'Tours', 'Contacto']

const NavbarClient = () => {
  const { user, loading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    console.log('Auth state cambió en el navbar:', user)
  }, [user])

  // No mostrar el navbar mientras se verifica autenticación
  if (loading) return null

  return (
    <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{ wrapper: 'max-w-6xl mx-auto' }}>
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
        {!user ? (
          <NavbarRegularPortion />
        ) : user.isAdmin ? (
          <NavbarAdminPortion getInitials={getInitials} />
        ) : (
          <NavbarUserPortion getInitials={getInitials} />
        )}
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
    </Navbar>
  )
}

export default NavbarClient
