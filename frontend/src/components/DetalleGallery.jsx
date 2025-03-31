import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

const DetalleGallery = ({ tour }) => {
  console.log('Tour en DetalleGallery:', tour)

  // Verificamos que tour exista y que tenga imágenes
  const tourImages = tour && tour.images && Array.isArray(tour.images) ? tour.images : []

  // Usamos imágenes por defecto solo si es necesario
  const defaultImages = [
    'https://via.placeholder.com/800x600?text=Imagen+por+defecto',
    'https://via.placeholder.com/800x600?text=Imagen+por+defecto',
    'https://images.unsplash.com/photo-1483631224226-a219224bb76e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWNvbmNhZ3VhfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1598313795136-a202370958af?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1504359147064-a13220c2ea38?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ]

  // Determinar cuántas imágenes reales tenemos
  const validTourImages = tourImages.filter(img => img && typeof img === 'string' && img.trim() !== '')
  const imageCount = validTourImages.length

  // Función para generar el layout según el número de imágenes
  const getGalleryItems = () => {
    // Si no hay imágenes válidas, usar al menos una imagen por defecto
    if (imageCount === 0) {
      return [{ imageId: 1, src: defaultImages[0] }]
    }

    // Si hay imágenes, llenarlas con las que tenemos
    const items = validTourImages.map((src, index) => ({
      imageId: index + 1,
      src
    }))

    return items
  }

  // Generar los elementos de la galería
  const galleryItems = getGalleryItems()

  // Determinar qué clase de grid aplicar según la cantidad de imágenes
  const getGridClasses = () => {
    switch (imageCount) {
      case 1:
        return 'grid-cols-1 grid-rows-1'
      case 2:
        return 'grid-cols-2 grid-rows-1'
      case 3:
        return 'grid-cols-2 grid-rows-2'
      case 4:
        return 'grid-cols-2 grid-rows-2'
      case 5:
      default:
        return 'grid-cols-3 grid-rows-2'
    }
  }

  // Determinar la clase de altura según el número de imágenes
  const getHeightClass = () => {
    switch (imageCount) {
      case 1:
        return 'h-[300px] md:h-[350px] lg:h-[400px]'
      case 2:
        return 'h-[350px] md:h-[400px] lg:h-[450px]'
      case 3:
      case 4:
      case 5:
      default:
        return 'h-[450px] md:h-[550px] lg:h-[650px]'
    }
  }

  // CSS personalizado para cada contenedor de imagen
  const getContainerStyle = (index, total) => {
    const baseStyle = {
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      display: 'block'
    }

    // Agregar estilos específicos para cada layout
    // Mantenemos bordes redondeados solo en la parte inferior
    switch (total) {
      case 1:
        return {
          ...baseStyle,
          borderBottomLeftRadius: '0.75rem', // Solo bordes inferiores redondeados
          borderBottomRightRadius: '0.75rem'
        }
      case 2:
        if (index === 0) {
          return {
            ...baseStyle,
            borderBottomLeftRadius: '0.75rem' // Solo borde inferior izquierdo
          }
        } else {
          return {
            ...baseStyle,
            borderBottomRightRadius: '0.75rem' // Solo borde inferior derecho
          }
        }
      case 3:
        if (index === 0) {
          return {
            ...baseStyle,
            gridColumn: 'span 1',
            gridRow: 'span 2',
            borderBottomLeftRadius: '0.75rem' // Solo borde inferior izquierdo
          }
        } else if (index === 1) {
          return {
            ...baseStyle
            // Sin bordes redondeados arriba
          }
        } else {
          return {
            ...baseStyle,
            borderBottomRightRadius: '0.75rem' // Solo borde inferior derecho
          }
        }
      case 4: {
        const styles = { ...baseStyle }

        // Solo bordes inferiores redondeados
        if (index === 2) styles.borderBottomLeftRadius = '0.75rem'
        if (index === 3) styles.borderBottomRightRadius = '0.75rem'

        return styles
      }
      case 5:
      default: {
        const defaultStyles = { ...baseStyle }

        if (index === 0) {
          return {
            ...defaultStyles,
            gridRow: 'span 2',
            borderBottomLeftRadius: '0.75rem' // Solo borde inferior izquierdo
          }
        }
        if (index === 4) defaultStyles.borderBottomRightRadius = '0.75rem' // Solo borde inferior derecho

        return defaultStyles
      }
    }
  }

  // CSS personalizado para cada imagen individual
  const getImageStyle = () => {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      display: 'block'
    }
  }

  // Clases específicas para cada layout de grid
  const getLayoutClass = (index, total) => {
    let classes = ''

    switch (total) {
      case 3:
        if (index === 0) classes += ' col-span-1 row-span-2'
        break
      case 5:
        if (index === 0) classes += ' row-span-2'
        break
      default:
        break
    }

    return classes
  }

  return (
    <div className="mb-10">
      <div className={`grid gap-1 ${getGridClasses()} ${getHeightClass()}`}>
        {galleryItems.map((image, index) => (
          <LightGallery
            key={image.imageId}
            speed={500}
            plugins={[lgThumbnail, lgZoom]}
            elementClassNames={getLayoutClass(index, imageCount)}>
            <a href={image.src} style={getContainerStyle(index, imageCount)} className="gallery-item">
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <img src={image.src} alt={`Imagen ${index + 1} del tour`} style={getImageStyle()} />
              </div>
            </a>
          </LightGallery>
        ))}
      </div>
    </div>
  )
}

export default DetalleGallery
