import { Link } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Image } from '@heroui/react'

import { normalizeWords } from '../utils/normalizeWords.js'
import BrandButton from './BrandButton.jsx'

const CardMain = ({ data }) => {
  const img = data.imagenes[0]

  return (
    <Card className="py-3 px-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <small className="text-default-500">{normalizeWords(data.categoria)}</small>
        <Link to={`/tour/${data.idPaquete}`}>
          <h4 className="font-bold text-lg text-gray-800 hover:text-gray-600">
            {data.nombre}. {data.destino}
          </h4>
        </Link>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Link to={`/tour/${data.idPaquete}`}>
          <div className="w-full max-h-40 md:max-h-48 overflow-hidden rounded-xl flex justify-center items-center">
            <Image alt={data.destino} className="object-cover" src={img} zoomedWrapper />
          </div>
        </Link>

        <div className="text-sm text-gray-800 my-4 mb-2">{data.descripcion}</div>
      </CardBody>

      <CardFooter className="justify-between">
        <div>
          <p className="text-black font-semibold">${data.precio}</p>
        </div>
        <Link to={`/tour/${data.idPaquete}`}>
          <BrandButton color="brandColor" size="md">
            Ver más
          </BrandButton>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default CardMain
