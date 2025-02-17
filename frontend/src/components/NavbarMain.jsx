import { Navbar, NavbarBrand, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, NavbarContent, NavbarItem, Link, Button } from '@heroui/react'

function NavbarMain() {
  const menuItems = ['Lugares', 'Guias', 'Blog', 'Crear Usuario', 'Iniciar Sesion']

  const img = new URL(`../assets/Logo/isotipo_sm.png`, import.meta.url).href

  /*Primera parte es de Web, la segunda parte es Mobil*/
  return (
    <Navbar isBordered isBlurred="false">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarBrand className="w-sm">
        <img className="w-sm" src={img}></img>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex " justify="end">
        <NavbarItem>
          <Link color="foreground" href="#">
            Lugares
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Guias
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Blog
          </Link>
        </NavbarItem>
        <NavbarItem className="ml-10" as={Link} color="primary" href="#" variant="flat">
          <Link href="#">Iniciar Sesion</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Crear Usuario
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden">
        <NavbarItem className="ml-10" as={Link} color="primary" href="#" variant="flat">
          <Link href="#">Iniciar Sesion</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Crear Usuario
          </Button>
        </NavbarItem>
      </NavbarContent>
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
