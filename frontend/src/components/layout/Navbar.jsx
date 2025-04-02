import { useState } from 'react'
import {
  Navbar as NavbarUi,
  NavbarBrand,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  NavbarContent,
  NavbarItem,
  Image,
  Link as HeroLink
} from '@heroui/react'
import { useAuth } from '@context/AuthContext.jsx'
import img from '@assets/Logo/logo_navbar/svg/isotipo_sm.svg'

import NavbarRegularPortion from './NavbarRegularPortion.jsx'
import NavbarClientPortion from './NavbarClientPortion.jsx'
import NavbarAdminPortion from './NavbarAdminPortion.jsx'

const menuItems = [
  { name: 'Sobre Nosotros', path: '/about' },
  { name: 'Tours', path: '/tours' },
  { name: 'Contacto', path: '/contacto' }
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAdmin } = useAuth()

  const name = user?.name || ''
  const lastName = user?.lastName || ''
  const email = user?.email || ''
  const avatar = user?.avatar || ''
  const role = user?.role || ''

  let dynamicPortion

  if (user && isAdmin) {
    dynamicPortion = <NavbarAdminPortion avatar={avatar} name={name} lastName={lastName} email={email} />
  } else if (user && (role === 'CLIENT' || role === 'client')) {
    dynamicPortion = <NavbarClientPortion avatar={avatar} name={name} lastName={lastName} email={email} />
  } else {
    dynamicPortion = <NavbarRegularPortion />
  }

  console.log('name from navbar:', name)

  return (
    <NavbarUi isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{ wrapper: 'max-w-6xl mx-auto' }}>
      {/* Marca y Logo */}
      <NavbarBrand>
        <HeroLink href="/" className="flex text-black">
          <Image alt="Glocal Tour isotipo" className="mr-2" src={img} width="20" radius="none" />
          <p className="font-bold text-inherit">Glocal Tour</p>
        </HeroLink>
      </NavbarBrand>

      {/* Menú principal en pantallas grandes */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index}>
            <HeroLink className="sm:text-sm md:text-base text-slate-800 hover:text-red-600" href={item.path}>
              {item.name}
            </HeroLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Menú hamburguesa en móviles */}
      <NavbarMenuToggle aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} className="sm:hidden" />
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <HeroLink className="w-full" href={item.path}>
              {item.name}
            </HeroLink>
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
