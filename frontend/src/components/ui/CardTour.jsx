import { Link } from 'react-router-dom'
import { Card, CardHeader, CardFooter, CardBody, Image, Chip, Divider, Button, Tooltip } from '@heroui/react'
import { normalizeWords } from '@utils/normalizeWords.js'
import { useFavorites } from '@context/FavoritesContext'

import './cardTour.scss'

const CardTour = ({ data }) => {
  const { toggleFavorite, isFavorite, isAuthenticated } = useFavorites()
  const isCurrentlyFavorite = isFavorite(data.id)

  const URL = `/tour/${data.id}`
  const img = data.images[0]

  const handleFavoriteClick = e => {
    e.preventDefault() // Prevent navigating to tour page when clicking the favorite button
    toggleFavorite(data)
  }

  const includes = data.includes.slice(0, 3).map((element, index) => (
    <div key={index} className="card_tour-include">
      <div className="card_tour-include_icon-wrapper">
        <div dangerouslySetInnerHTML={{ __html: element.icon }} className="card_tour-include_icon" />
      </div>
      <div className="card_tour-include_text">
        <p>{element.type}</p>
        <p>{element.details}</p>
      </div>
    </div>
  ))

  const renderTags = tags => {
    // Limitar a 3 etiquetas
    const visibleTags = tags.slice(0, 2)
    const remainingTags = tags.length > 3 ? tags.length - 3 : 0

    return (
      <div className="card_tour-tags-container">
        {visibleTags.map((tag, index) => (
          <Chip
            key={index}
            size="sm"
            variant="dot"
            color="primary"
            className="card_tour-tag"
            startContent={<span className="material-symbols-outlined icon">bookmarks</span>}>
            {normalizeWords(tag)}
          </Chip>
        ))}

        {remainingTags > 0 && (
          <Chip size="sm" variant="flat" color="default" className="card_tour-tag-more">
            +{remainingTags}
          </Chip>
        )}
      </div>
    )
  }

  // Format date in a more readable way
  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <Card className="card_tour">
      <CardHeader className="card_tour-header">
        <div className="w-full card_tour-tags-wrapper">
          <div className="flex justify-between items-center w-full">
            {renderTags(data.tags)}
            <Tooltip
              content={
                isAuthenticated ? (isCurrentlyFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos') : 'Iniciar sesión para guardar'
              }>
              <button
                onClick={handleFavoriteClick}
                className="card_tour-favorite-btn"
                aria-label={isCurrentlyFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                <span className={`material-symbols-outlined icon ${isCurrentlyFavorite ? 'favorite-active' : ''}`}>favorite</span>
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="flex w-full items-center">
          <Link to={URL} className="card_tour-title">
            {data.name}
          </Link>
        </div>
      </CardHeader>

      <CardBody className="card_tour-body">
        <Link to={URL} className="card_tour-image_container">
          <Image alt={data.destination.city.name} src={img} isZoomed />
        </Link>

        <div className="card_tour-locations">
          <Chip className="card_tour-location" size="sm" variant="flat" color="primary">
            <div className="location-content">
              <span className="material-symbols-outlined icon">globe_location_pin</span>
              <span className="location-text">
                {data.destination.region} | {data.destination.city.name}
              </span>
            </div>
          </Chip>

          <Chip className="card_tour-location" size="sm" variant="flat" color="primary">
            <div className="location-content">
              <span className="material-symbols-outlined icon">pin_drop</span>
              <span className="location-text">{data.destination.country}</span>
            </div>
          </Chip>
        </div>

        <div className="card_tour-includes">
          {includes}
          {data.includes.length > 2 ? (
            <div className="card_tour-include card_tour-include-more">
              <div className="card_tour-more">
                <div className="card_tour-more_count">+ {data.includes.length - 2}</div>
                <div className="card_tour-more_text">Más</div>
              </div>
            </div>
          ) : null}
        </div>

        <Divider className="card_tour-divider" />

        <p className="card_tour-description mb-6">{data.description}</p>

        {data.availability && data.availability.length > 0 && (
          <div className="card_tour-availability">
            <div className="flex flex-row items-center card_tour-availability-header mb-1">
              <span className="material-symbols-outlined icon">event_available</span>
              <h4 className="text-sm text-gray-600">Fechas de salida</h4>
            </div>
            <div className="card_tour-availability-dates">
              {data.availability.map((item, index) => (
                <Chip key={index} color="success" variant="flat" className="card_tour-availability-chip mr-2">
                  {formatDate(item.departureTime)}
                </Chip>
              ))}
            </div>
          </div>
        )}
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
