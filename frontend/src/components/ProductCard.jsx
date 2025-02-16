import { Card, Button, CardFooter, CardBody, Image } from '@heroui/react'

const ProductCard = ({ data }) => {
  //id, placeType, imageUrl, place, location, description

  const img = new URL(`../assets/Lugares/md/${data.imageUrl}`, import.meta.url).href
  console.log(img)

  return (
    <Card className="py-4">
      <CardBody className="overflow-visible py-2">
        <Image alt="Imagen del Lugar." className="object-cover rounded-xl" src={img} width={270} />
      </CardBody>

      <CardFooter className="pb-0 pt-2 px-4 flex-col items-start">
        <h3 className="font-bold text-large">{data.place}</h3>
        <h3 className="font-bold text-large">{data.location}</h3>
        <p className="text-tiny">{data.description}</p>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
