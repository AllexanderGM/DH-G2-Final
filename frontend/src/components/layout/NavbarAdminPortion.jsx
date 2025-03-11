import { NavbarItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from '@heroui/react'
import { Link } from 'react-router-dom'
import { useAuth } from '@context/AuthContext.jsx'

const NavbarAdmin = ({ avatar, name, lastName, email }) => {
  const { logout } = useAuth()

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

export default NavbarAdmin
