import { Link } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Image } from '@heroui/react'

import BrandButton from './BrandButton.jsx'

const CardModel = ({ data }) => {
  const img = new URL(`../assets/Lugares/md/${data.imageUrl}`, import.meta.url).href
  // <Card className="py-3 px-4" isPressable>
  return (
    <Card className="py-3 px-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <small className="text-default-500">{data.placeType}</small>
        <Link to={`/tour/${data.id}`}>
          <h4 className="font-bold text-large">{data.place}</h4>
        </Link>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Link to={`/tour/${data.id}`}>
          <Image alt={data.place} className="object-cover rounded-xl" src={img} />
        </Link>
        <div className="text-md my-4">{data.description}</div>
      </CardBody>

      <CardFooter className="justify-between">
        <div>
          <p className="text-black text-tiny">{data.disponibilidad}</p>
          <p className="text-black text-tiny">Cupos: {data.cupos}</p>
        </div>
        <Link to={`/tour/${data.id}`}>
          <BrandButton color="brandColor">Ver más</BrandButton>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default CardModel
