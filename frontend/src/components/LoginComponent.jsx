import { Button, Input, Card,Image } from "@heroui/react";
import { Link } from "react-router-dom";
import BrandButton from "./BrandButton";
import imgLg from "../assets/Backgrounds/forestman.jpg"

const LoginComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card
      className="flex flex-row w-[700px] overflow-hidden h-[500px]">
          <div className="w-1/2 h-full relative flex">
          <img
         src= {imgLg}
         alt="Register"
          className="w-full h-full min-h-full object-cover justify-center"
        />
      </div>
      <div className="w-1/2 p-6 flex flex-col justify-center"> 
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Iniciar Sesión</h2>
        <form>
        <Input isRequired
          errorMessage={({validationDetails, validationErrors}) => {
          if (validationDetails.typeMismatch) {
            return "Please enter a valid email address";
          }

          return validationErrors;
        }}
        label="Correo Electrónico"
        labelPlacement="outside"
        name="email"
        placeholder="correo@ejemplo.com"
        type="email"
        className="mb-4"
      />
       <div className="mb-4">
                <Input
                  isRequired
                  type="password"
                  label="Contraseña"
                  labelPlacement="outside"
                  placeholder="********"
                  className="mb-4"
                />
      </div>
       
          <BrandButton variant="solid" color="brandColor" className="w-full">Ingresar</BrandButton>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          ¿No tienes cuenta? <Link to="/register" className="text-primary-500 hover:underline">Regístrate aquí</Link>
        </p>
      </div>


      </Card>
    </div>
  );
}

export default LoginComponent