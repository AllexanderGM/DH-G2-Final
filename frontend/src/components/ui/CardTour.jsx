import { Link } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Image, Chip, Divider, Button } from '@heroui/react'
import { normalizeWords } from '@utils/normalizeWords.js'

import './cardTour.scss'

const CardTour = ({ data }) => {
  const URL = `/tour/${data.id}`
  const img = data.images[0]

  const includes = data.includes.slice(0, 3).map((element, index) => (
    <div key={index} className="card_tour-include">
      <div dangerouslySetInnerHTML={{ __html: element.icon }} className="card_tour-include_icon" />
      <div className="card_tour-include_text">
        <p>{element.type}</p>
        <p>{element.details}</p>
      </div>
    </div>
  ))

  const renderTags = tags => {
    return tags.map((tag, index) => (
      <Chip
        key={index}
        size="sm"
        variant="dot"
        color="primary"
        className="card_tour-tag"
        startContent={<span className="material-symbols-outlined icon">bookmarks</span>}>
        {normalizeWords(tag)}
      </Chip>
    ))
  }

  return (
    <Card className="card_tour">
      <CardHeader className="card_tour-header">
        {/* <Chip */}
        {/*   size="sm" */}
        {/*   variant="dot" */}
        {/*   color="primary" */}
        {/*   className="card_tour-tag" */}
        {/*   startContent={<span className="material-symbols-outlined icon">bookmarks</span>}> */}
        {/*   {normalizeWords(data.tag)} */}
        {/* </Chip> */}
        {renderTags(data.tags)}
        <Link to={URL} className="card_tour-title">
          {data.name}
        </Link>
      </CardHeader>

      <CardBody className="card_tour-body">
        <Link to={URL} className="card_tour-image_container">
          <Image alt={data.destination.city.name} src={img} isZoomed />
        </Link>

        <div className="card_tour-locations">
          <Chip className="card_tour-location" size="sm" variant="flat" color="primary">
            <span className="material-symbols-outlined icon">globe_location_pin</span>
            {data.destination.region} | {data.destination.city.name}
          </Chip>

          <Chip className="card_tour-location" size="sm" variant="flat" color="primary">
            <span className="material-symbols-outlined icon">pin_drop</span>
            {data.destination.country}
          </Chip>
        </div>

        <div className="card_tour-includes">{includes}</div>

        {data.includes.length > 3 ? (
          <div className="card_tour-more">
            <div className="card_tour-more_count">+ {data.includes.length - 3}</div>
            <div className="card_tour-more_text">Más</div>
          </div>
        ) : null}

        <Divider className="card_tour-divider" />

        <p className="card_tour-description">{data.description}</p>
      </CardBody>

      <CardFooter className="card_tour-footer">
        <div className="card_tour-price">
          <div className="card_tour-price_type">
            <span className="material-symbols-outlined icon">man</span>
            <span>Adulto/a</span>
            <span className="price">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(data.adultPrice)}</span>
          </div>

          <div className="card_tour-price_type">
            <span className="material-symbols-outlined icon">escalator_warning</span>
            <span>Niño/a</span>
            <span className="price">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(data.childPrice)}</span>
          </div>
        </div>

        <Button color="primary" className="card_tour-button">
          <Link to={URL}>Ver más</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CardTour
