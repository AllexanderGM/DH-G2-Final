import { Card, CardBody, CardFooter } from '@heroui/react'

const Categories = () => {
  const list = [
    {
      title: 'Ecoturismo',
      icon: 'Eco'
    },
    {
      title: 'Lujo',
      icon: 'hotel_class'
    },
    {
      title: 'Aventura',
      icon: 'hiking'
    },
    {
      title: 'Adrenalina',
      icon: 'paragliding'
    },
    {
      title: 'Playa',
      icon: 'pool'
    },
    {
      title: 'Montañismo',
      icon: 'Landscape'
    }
  ]

  return (
    <div className="w-full max-w-6xl gap-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-20">
      {list.map((item, index) => (
        <Card
          key={index}
          className="hover:outline hover:outline-solid hover:outline-[#E86C6E]"
          isPressable
          shadow="sm"
          onPress={() => console.log('item pressed')}>
          <CardBody className="overflow-visible p-0 text-center">
            <span
              className="material-symbols-outlined flex items-center justify-center text-6xl w-full object-cover h-[100px]"
              width="100%">
              {item.icon}
            </span>
          </CardBody>
          <CardFooter className="text-small justify-center">
            <b>{item.title}</b>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default Categories
