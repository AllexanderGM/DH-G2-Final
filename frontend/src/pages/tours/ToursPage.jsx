import { Spinner, Button } from '@heroui/react'
import { useSearch } from '@context/SearchContext'
import { useState, useEffect } from 'react'
import CardMain from '@components/ui/CardTour.jsx'
import './allTours.scss'

const ToursPage = () => {
  const { searchResults, loading, searchTerm } = useSearch()
  const { success, data = [] } = searchResults || {}
  const ITEMS_PER_PAGE = 9
  const [currentPage, setCurrentPage] = useState(1)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const emptyPlaces = success && data.length === 0
  const isSearching = searchTerm.trim() !== ''
  const visibleItems = currentPage * ITEMS_PER_PAGE
  const hasMoreItems = data.length > visibleItems

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowScrollTop(scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  let title = 'Explora Nuestros Tours'
  let subtitle = 'Descubre destinos increíbles y experiencias únicas en cada rincón del mundo.'

  if (isSearching) {
    title = `Resultados para "${searchTerm}"`
    subtitle = emptyPlaces
      ? 'No encontramos tours que coincidan con tu búsqueda. Intenta con otros términos.'
      : `Encontramos ${data.length} tours que coinciden con tu búsqueda.`
  } else if (emptyPlaces) {
    title = 'No hay tours disponibles...'
    subtitle = 'Por favor, vuelve más tarde para ver nuestra oferta de tours.'
  }

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="tours_body-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="title">{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>

      <div className="tours_body-content">
        {loading ? (
          <div className="grid content-center gap-8">
            <Spinner classNames={{ label: 'text-foreground mt-4' }} label="Cargando" variant="wave" />
          </div>
        ) : success ? (
          <>
            <div className="tours_body-grid">
              {data.slice(0, visibleItems).map(place => (
                <CardMain key={place.id} data={place} />
              ))}
            </div>
            {hasMoreItems && (
              <div className="flex justify-center mt-8">
                <Button color="primary" variant="flat" onPress={handleLoadMore} className="px-8">
                  <span className="material-symbols-outlined mr-2">add</span>
                  Cargar más tours
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="grid content-center gap-8">
            <p className="text-center text-gray-500">Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.</p>
          </div>
        )}
      </div>

      <Button
        isIconOnly
        color="primary"
        variant="flat"
        onPress={scrollToTop}
        className={`fixed right-[4vw] bottom-24 z-50 rounded-full shadow-lg transition-all duration-300 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
        aria-label="Volver arriba">
        <span className="material-symbols-outlined text-2xl">arrow_upward</span>
      </Button>
    </div>
  )
}

export default ToursPage
