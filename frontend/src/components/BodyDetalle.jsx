import { Card, CardBody, CardHeader, CardFooter, Chip } from '@heroui/react'

import CardDetalle from './CardDetalle.jsx'

const BodyDetalle = ({ tour }) => {
  const incluye = [
    { icon: 'villa', tag: 'Alojamiento' },
    { icon: 'directions_bus', tag: 'Transporte' },
    { icon: 'confirmation_number', tag: 'Boletos' },
    { icon: 'icecream', tag: 'Snack' },
    { icon: 'water_full', tag: 'Bebidas' },
    { icon: 'breakfast_dining', tag: 'Desayuno' },
    { icon: 'ramen_dining', tag: 'Almuerzo' },
    { icon: 'restaurant', tag: 'Cena' },
    { icon: 'familiar_face_and_zone', tag: 'Guía' },
    { icon: 'local_hospital', tag: 'Seguro de vida' },
    { icon: 'downhill_skiing', tag: 'Actividades' },
    { icon: 'photo_camera', tag: 'Fotografías' },
    { icon: 'redeem', tag: 'Souvenirs' },
    { icon: 'roller_skating', tag: 'Equipamiento' },
    { icon: 'rss_feed', tag: 'Wifi' },
    { icon: 'savings', tag: 'Propinas' },
    { icon: 'accessibility_new', tag: 'Asistencia' }
  ]

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-10">
        <div className="lg:col-span-3 pr-0 pl-0">
          <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
            <h2 className="text-2xl font-bold mb-4">Incluye</h2>
            <CardBody className="grid grid-cols-3 ">
              <div className="flex justify-start items-center ">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="material-symbols-outlined">{incluye[0].icon}</span>
                </div>
                <p>{incluye[0].tag}</p>
              </div>
              <div className="flex justify-start items-center pb-2 ">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="material-symbols-outlined">{incluye[5].icon}</span>
                </div>
                <p>{incluye[5].tag}</p>
              </div>
              <div className="flex justify-start items-center pb-2 ">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="material-symbols-outlined">{incluye[3].icon}</span>
                </div>
                <p>{incluye[3].tag}</p>
              </div>
              <div className="flex justify-start items-center pb-2 ">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="material-symbols-outlined">{incluye[6].icon}</span>
                </div>
                <p>{incluye[6].tag}</p>
              </div>
              <div className="flex justify-start items-center pb-2 ">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="material-symbols-outlined">{incluye[12].icon}</span>
                </div>
                <p>{incluye[12].tag}</p>
              </div>
              <div className="flex justify-start items-center pb-2 ">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="material-symbols-outlined">{incluye[8].icon}</span>
                </div>
                <p>{incluye[8].tag}</p>
              </div>
            </CardBody>
          </Card>
          <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
            <div>
              <h2 className="text-2xl font-bold mb-6">Descripción del lugar</h2>
            </div>
            <p className="text-slate-700">
              El Valle del Aconcagua es una cuenca de origen cordillerano, ubicada en la Región de Valparaíso a unos 90 km al norte de
              Santiago y unos 105 km al oriente de la Ciudad de Valparaíso. Lo atraviesa el río Aconcagua que alimenta los fértiles campos
              que lo circundan.
            </p>
          </Card>
          <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
            <h2 className="text-2xl font-bold mb-4">Detalles</h2>
            <div className="grid grid-cols-2 gap-4">
              <Chip size="sm" variant="flat" color="primary" className="flex items-center justify-start px-3">
                <span className="material-symbols-outlined icon text-base mr-2 flex-shrink-0">face</span>
                Edad: 12 a 99 años
              </Chip>
              <Chip size="sm" variant="flat" color="primary" className="flex items-center justify-start px-3">
                <span className="material-symbols-outlined icon text-base mr-2 flex-shrink-0">groups</span>
                Cupos: 9 cupos
              </Chip>
              <Chip size="sm" variant="flat" color="primary" className="flex items-center justify-start px-3">
                <span className="material-symbols-outlined icon text-base mr-2 flex-shrink-0">schedule</span>
                Duración: 1h 30m
              </Chip>
              <Chip size="sm" variant="flat" color="primary" className="flex items-center justify-start px-3">
                <span className="material-symbols-outlined icon text-base mr-2 flex-shrink-0">language</span>
                Guía: inglés-español
              </Chip>
            </div>
          </Card>
          <Card className="rounded-lg border border-gray-300 mb-8 p-8 pb-10 text-md">
            <h2 className="text-2xl font-bold mb-4">Itinerario</h2>
            <div className="relative pl-6">
              <div className="absolute left-[0.35rem] top-0 bottom-0 w-0.5 bg-gray-300"></div>
              <ul className="text-slate-700 list-none space-y-4">
                <li className="relative">
                  <div className="absolute left-[-1.38rem] top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                  Visita a la Viña Errázuriz
                </li>
                <li className="relative">
                  <div className="absolute left-[-1.38rem] top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                  Paseo por la Viña
                </li>
                <li className="relative">
                  <div className="absolute left-[-1.38rem] top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                  Degustación de vinos y cóctel
                </li>
                <li className="relative">
                  <div className="absolute left-[-1.38rem] top-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                  Caminata por el Valle de Quillota
                </li>
              </ul>
            </div>
          </Card>
        </div>
        <CardDetalle tour={tour} />
      </div>
    </div>
  )
}

export default BodyDetalle
