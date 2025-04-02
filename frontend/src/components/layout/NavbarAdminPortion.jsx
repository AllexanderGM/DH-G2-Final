import { NavbarItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User, Link as HeroLink } from '@heroui/react'
import { useAuth } from '@context/AuthContext.jsx'

const NavbarAdmin = ({ avatar, name, lastName, email }) => {
  const { logout } = useAuth()

  return (
    <>
      <div className="flex gap-3 items-center">
        <NavbarItem>
          <HeroLink color="primary" className="hover:text-red-600 sm:text-sm md:text-base" href="/crear-tour">
            Crear tour
          </HeroLink>
        </NavbarItem>
      </div>

      <div className="flex gap-3 items-center">
        <NavbarItem>
          <HeroLink color="primary" className="hover:text-red-600 sm:text-sm md:text-base" href="/admin">
            Admin panel
          </HeroLink>
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
              <DropdownItem key="profile" href="/profile-user">
                Mi perfil
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
