import { Card, CardBody, CardFooter } from '@heroui/react'

import './cardCategories.scss'

const CardCategories = ({ item }) => {
  const handlerCard = item => {
    console.log(`${item} pressed`)
  }

  return (
    <Card className="card-categories" isPressable shadow="sm" onPress={() => handlerCard(item.title)}>
      <CardBody className="card-categories-body">
        <span className="material-symbols-outlined">{item.icon}</span>
      </CardBody>
      <CardFooter className="card-categories-footer">
        <b>{item.title}</b>
      </CardFooter>
    </Card>
  )
}

export default CardCategories
