import React from 'react'
import img from '../assets/Logo/logo_footer/isotipo_sm 1-footer.png'
import inst from '../assets/Logo/logo_footer/instagram-footer.png'
import faceb from '../assets/Logo/logo_footer/faceb-footer.png'
import twiter from '../assets/Logo/logo_footer/twiter-footer.png'
import github from '../assets/Logo/logo_footer/github-footer.png'
const Footer = () => {
  return (
    <footer className="w-full bg-white text-black py-6 px-8 border-t flex flex-col md:flex-row md:justify-between md:items-center">
      {/* Logo alineado a la izquierda */}
      <div className="flex items-center md:flex-grow justify-center md:justify-start">
        <img src={img} alt="Glocal Tour isotipo" className="h-10" />
      </div>

      {/* Texto centrado */}
      <div className="flex md:flex-grow justify-center">
        <span className="text-sm md:text-base font-medium">© Glocal Tour. {new Date().getFullYear()}</span>
      </div>

      {/* Redes sociales alineadas a la derecha */}
      <div className="flex flex-1 items-center justify-center md:justify-end space-x-4 mt-4 md:mt-0">
        <img src={inst} alt="Instagram" className="h-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1" />

        <img src={faceb} alt="Facebook" className="h-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1" />

        <img src={twiter} alt="Twitter" className="h-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1" />

        <img src={github} alt="GitHub" className="h-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1" />
      </div>
    </footer>
  )
}

export default Footer
