import { NavbarItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from '@heroui/react'
import { Link } from 'react-router-dom'
import { useAuth } from '@context/AuthContext.jsx'
import { useFavorites } from '@context/FavoritesContext.jsx'

import FavoritesCount from '../../pages/favorites/components/FavoritesCount.jsx'

const NavbarClientPortion = ({ avatar, name, lastName, email }) => {
  const { logout } = useAuth()

  return (
    <div className="flex gap-3 items-center">
      <NavbarItem>
        <FavoritesCount />
      </NavbarItem>

      <NavbarItem>
        <Dropdown>
          <DropdownTrigger>
            <User
              avatarProps={{
                src: avatar
              }}
              description={email}
              name={`${name} ${lastName}`}
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions">
            <DropdownItem key="profile">
              <Link to="/profile-user">Mi Perfil</Link>
            </DropdownItem>
            <DropdownItem key="favorites">
              <Link to="/favoritos">Mis Tours Guardados</Link>
            </DropdownItem>
            <DropdownItem key="logout" color="danger" onPress={logout}>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    </div>
  )
}

export default NavbarClientPortion
