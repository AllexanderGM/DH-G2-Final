import {Navbar, NavbarBrand, NavbarMenu ,NavbarMenuItem,NavbarMenuToggle,NavbarContent, NavbarItem, Link, Button} from "@heroui/react";



const Header = () => {

    const menuItems = [
        "Lugares",
        "Guias",
        "Blog",
        "Crear Usuario",
        "Iniciar Sesion"
      ];
    

/*Primera parte es de Web, la segunda parte es Mobil*/
    return (
        <Navbar isBordered isBlurred="false" class="m-0 p-0">
        
        <NavbarContent className="sm:hidden" justify="start">
            <NavbarMenuToggle /> 
        </NavbarContent>

        <NavbarBrand>
          <p className="font-bold text-inherit">GLOCAL GUIDE</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex " justify="end">
        <NavbarItem >
            <Link color="foreground" href="#">
              Lugares
            </Link>
          </NavbarItem>
          <NavbarItem >
            <Link color="foreground" href="#">
              Guias
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground"  href="#">
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
            <Link
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      </Navbar>
    )
  }
  
  export default Header