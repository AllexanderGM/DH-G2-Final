import { Link } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Image } from '@heroui/react'

import { normalizeWords } from '../utils/normalizeWords.js'
import BrandButton from './BrandButton.jsx'

const CardMain = ({ data }) => {
  const img = data.images[0]

  return (
    <Card className="py-3 px-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <small className="text-default-500">{normalizeWords(data.tag)}</small>
        <Link to={`/tour/${data.id}`}>
          <h4 className="font-bold text-lg text-gray-800 hover:text-gray-600">
            {data.name}. {data.destination.city.name}
          </h4>
        </Link>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Link to={`/tour/${data.id}`}>
          <div className="w-full max-h-40 md:max-h-48 overflow-hidden rounded-xl flex justify-center items-center">
            <Image alt={data.destination.city.name} className="object-cover" src={img} zoomedWrapper />
          </div>
        </Link>

        <div className="text-sm text-gray-800 my-4 mb-2">{data.description}</div>
      </CardBody>

      <CardFooter className="justify-between">
        <div>
          <p className="text-black font-semibold">${data.adultPrice}</p>
        </div>
        <Link to={`/tour/${data.id}`}>
          <BrandButton color="brandColor" size="md">
            Ver más
          </BrandButton>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default CardMain
