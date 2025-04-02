import { Card, CardBody, CardHeader, Avatar, Button } from '@heroui/react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

import Diego from '../../assets/perfiles/Diego.jpeg'
import Alejandra from '../../assets/perfiles/Alejandra.jpeg'
import Kevin from '../../assets/perfiles/Kevin.jpeg'
import Adriana from '../../assets/perfiles/Adriana.jpeg'
import Jeisson from '../../assets/perfiles/Jeisson.jpeg'
import Yerlin from '../../assets/perfiles/Yerlin.jpeg'
import Adrian from '../../assets/perfiles/Adrian.jpeg'
import Andres from '../../assets/perfiles/Andres.jpeg'

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Diego',
      role: 'Frontend Developer',
      description: 'Desarrollo de componentes UI/UX y experiencia de usuario',
      github: '#',
      linkedin: '#',
      image: Diego
    },
    {
      name: 'Alejandra',
      role: 'Backend Developer',
      description: 'Desarrollo de APIs y lógica de negocio',
      github: '#',
      linkedin: '#',
      image: Alejandra
    },
    {
      name: 'Kevin',
      role: 'Full Stack Developer',
      description: 'Desarrollo full stack y arquitectura de software',
      github: '#',
      linkedin: '#',
      image: Kevin
    },
    {
      name: 'Adriana',
      role: 'UI/UX Designer',
      description: 'Diseño de interfaces y experiencia de usuario',
      github: '#',
      linkedin: '#',
      image: Adriana
    },
    {
      name: 'Jeisson',
      role: 'Frontend Developer',
      description: 'Desarrollo de componentes y optimización de rendimiento',
      github: '#',
      linkedin: '#',
      image: Jeisson
    },
    {
      name: 'Yerlin',
      role: 'Backend Developer',
      description: 'Desarrollo de APIs y gestión de base de datos',
      github: '#',
      linkedin: '#',
      image: Yerlin
    },
    {
      name: 'Adrián',
      role: 'Full Stack Developer',
      description: 'Desarrollo full stack y testing',
      github: '#',
      linkedin: '#',
      image: Adrian
    },
    {
      name: 'Andrés',
      role: 'Full Stack Developer',
      description: 'Desarrollo full stack y arquitectura de software',
      github: '#',
      linkedin: '#',
      image: Andres
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre Glocal Tours</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Somos un equipo apasionado por el turismo y la tecnología, comprometidos con crear experiencias únicas para nuestros usuarios.
          Nuestra misión es conectar viajeros con destinos increíbles a través de una plataforma innovadora y fácil de usar.
        </p>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nuestro Equipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center pb-0">
                <Avatar src={member.image} size="lg" isBordered color="primary" className="w-24 h-24" />
                <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </CardHeader>
              <CardBody className="text-center">
                <p className="text-sm text-gray-600 mb-4">{member.description}</p>
                <div className="flex justify-center gap-4">
                  <Button
                    isIconOnly
                    color="primary"
                    variant="light"
                    aria-label="GitHub"
                    as="a"
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer">
                    <FaGithub className="text-xl" />
                  </Button>
                  <Button
                    isIconOnly
                    color="primary"
                    variant="light"
                    aria-label="LinkedIn"
                    as="a"
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer">
                    <FaLinkedin className="text-xl" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutPage
