import { NavbarItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react'

const NavbarAdminPortion = ({ getInitials, user }) => {
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
                name={getInitials(user?.name)}
                size="sm"
                className="cursor-pointer"
                classNames={{
                  base: 'bg-gradient-to-br from-[#FF898B] to-[#E86C6E] text-white'
                }}
              />
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions">
              <DropdownItem key="profile">Perfil</DropdownItem>
              <DropdownItem key="settings">Configuración</DropdownItem>
              <DropdownItem key="logout" color="danger">
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
