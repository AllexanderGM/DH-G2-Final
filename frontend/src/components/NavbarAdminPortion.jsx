import { NavbarItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

const NavbarAdminPortion = ({ getInitials }) => {
  const { user, logout } = useAuth()

  const navigate = useNavigate()

  const handleProfileClick = () => {
    navigate('/profile-admin')
  }

  return (
    <>
      <div className="flex gap-3 items-center">
        <NavbarItem>
          <Link color="primary" className="hover:text-red-600 sm:text-sm md:text-base" href="/crear-tour">
            Crear tour
          </Link>
        </NavbarItem>
      </div>
      <div className="flex gap-3 items-center">
        <NavbarItem>
          <Link color="primary" className="hover:text-red-600 sm:text-sm md:text-base" href="/admin">
            Admin panel
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                name={getInitials(user?.name, user?.lastName)}
                size="sm"
                className="cursor-pointer"
                classNames={{
                  base: 'bg-gradient-to-br from-[#FF898B] to-[#E86C6E] text-white'
                }}
              />
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions">
              <DropdownItem key="profile" onPress={handleProfileClick}>
                Mi Perfil
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={logout}>
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </div>
    </>
  )
}

export default NavbarAdminPortion
