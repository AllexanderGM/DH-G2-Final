import { Link } from 'react-router-dom'

import { Card, CardHeader, CardFooter, CardBody, Image } from '@heroui/react'

import BrandButton from './BrandButton.jsx'

const CardModel = ({ data }) => {
  const img = new URL(`../assets/Lugares/md/${data.imageUrl}`, import.meta.url).href

  return (
    <Card className="py-3 px-4" isPressable>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <small className="text-default-500">Playa</small>
        <h4 className="font-bold text-large">{data.place}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image alt={data.place} className="object-cover rounded-xl" src={img} />
        <div className="text-md my-4">{data.description}</div>
      </CardBody>

      <CardFooter className="justify-between">
        <div>
          <p className="text-black text-tiny">Disponible</p>
          <p className="text-black text-tiny">Cupos: 5</p>
        </div>
        <Link to={`/tour/${data.id}`}>
          <BrandButton color="brandColor">Ver más</BrandButton>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default CardModel
