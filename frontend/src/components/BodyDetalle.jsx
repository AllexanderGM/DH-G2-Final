import { Card, CardHeader, CardFooter, CardBody, Image } from '@heroui/react'

const BodyDetalle = ({ tour }) => {
  //   ;<p className="text-gray-800">{tour.descripcion}</p>
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className=" lg:col-span-2 pr-20 pl-0 text-[0.9rem]">
          <div>
            <h2 className="text-[1rem] font-bold mb-4">Descripción del lugar</h2>
            <p className="text-gray-800">
              El Valle del Aconcagua es una cuenca de origen cordillerano, ubicada en la Región de Valparaíso a unos 90 km al norte de
              Santiago y unos 105 km al oriente de la Ciudad de Valparaíso. Lo atraviesa el río Aconcagua que alimenta los fértiles campos
              que lo circundan.
            </p>
          </div>
          <hr className="bordegray border-solid border-gray-300 mt-8 mb-8" />
          <div>
            <h2 className="text-[1rem] font-bold mb-4">Detalles</h2>
            <ul>
              <li>Edad: 12 a 99 años</li>
              <li>Cupos: 9 cupos</li>
              <li>Duración: 1h 30m</li>
              <li>Guía: inglés-español</li>
            </ul>
          </div>
          <hr className="bordegray border-solid border-gray-300 mt-8 mb-8" />
          <div>
            <h2 className="text-[1rem] font-bold mb-4">Itinerario</h2>
            <ul>
              <li>Visita a la Viña Errázuriz</li>
              <li>Paseo por la Viña</li>
              <li>Degustación de vinos y cóctel</li>
              <li>Caminata por el Valle de Quillota</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg">
          <Card className="py-3 px-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col justify-end">
              <p>
                Precio:{' '}
                <data value="99.99" className="font-bold text-xl">
                  $99.99
                </data>{' '}
                USD
              </p>
            </CardHeader>
            <CardBody className="overflow-visible py-2"></CardBody>

            <CardFooter className="justify-between"></CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BodyDetalle
