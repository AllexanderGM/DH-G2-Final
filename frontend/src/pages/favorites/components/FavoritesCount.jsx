import { Link } from 'react-router-dom'
import { Badge } from '@heroui/react'
import { useFavorites } from '@context/FavoritesContext'

import '../favoritesPage.scss'

const FavoritesCount = () => {
  const { favorites } = useFavorites()

  return (
    <div className="favorites-count">
      <Link to="/favoritos" aria-label="Ver favoritos">
        <span className="material-symbols-outlined icon">favorite</span>
        {favorites.length > 0 && (
          <Badge content={favorites.length} color="danger" className="bg-primary-500" shape="circle" placement="top-right" />
        )}
      </Link>
    </div>
  )
}

export default FavoritesCount
