import { useEffect, useState } from 'react'
import { Spinner } from '@heroui/react'
import { toursAllRandom } from '@services/tourService.js'

import CardMain from '../../../components/ui/CardTour.jsx'

import './body.scss'

const Body = () => {
  const [places, setPlaces] = useState(null)
  const { success, data = [] } = places || {}

  useEffect(() => {
    toursAllRandom()
      .then(setPlaces)
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <div className="tours_body-container">
      <h1 className="title">Recomendaciones</h1>

      <div className="tours_body-content">
        {success ? (
          <div className="tours_body-grid">
            {data.slice(0, 9).map(place => (
              <CardMain key={place.id} data={place} />
            ))}
          </div>
        ) : (
          <div className="grid content-center gap-8">
            <Spinner classNames={{ label: 'text-foreground mt-4' }} label="Cargando" variant="wave" />
          </div>
        )}
      </div>
    </div>
  )
}

export default Body
