import { Image } from '@heroui/react'
import LightGallery from 'lightgallery/react'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import ShareButtons from './ShareButtons'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

// prettier-ignore
const DetalleGallery = ({ tour }) => {
  console.log("Tour en DetalleGallery:", tour)

  // Verificamos que tour exista y que tenga imágenes
  const tourImages = tour && tour.images && Array.isArray(tour.images)
    ? tour.images
    : []

  // Usamos imágenes por defecto si no hay suficientes
  const defaultImages = [
    'https://via.placeholder.com/800x600?text=Imagen+por+defecto',
    'https://via.placeholder.com/800x600?text=Imagen+por+defecto',
    'https://images.unsplash.com/photo-1483631224226-a219224bb76e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWNvbmNhZ3VhfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1598313795136-a202370958af?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1504359147064-a13220c2ea38?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  ]

  const pseudoGallery = [
    {
      imageId: 1,
      src: tourImages[0] || defaultImages[0]
    },
    {
      imageId: 2,
      src: tourImages[1] || defaultImages[1]
    },
    {
      imageId: 3,
      src: tourImages[2] || defaultImages[2]
    },
    {
      imageId: 4,
      src: tourImages[3] || defaultImages[3]
    },
    {
      imageId: 5,
      src: tourImages[4] || defaultImages[4]
    }
  ]

  return (
    <div className="mb-10">
      <LightGallery animateThumb={true} speed={500} plugins={[lgThumbnail, lgZoom]} elementClassNames="grid grid-cols-3 grid-rows-2 gap-1">
        {pseudoGallery.map((image, index) => (
          <a
            href={image.src}
            key={image.imageId}
            className="block overflow-hidden first:row-span-2  first:rounded-bl-xl last:rounded-br-xl">
            <Image
              src={image.src}
              classNames={{
                wrapper: `w-full ${index === 0 && 'h-full'}`,
                img: `w-full h:full aspect-[16/10] ${index === 0 && 'h-full'} object-cover rounded-none`
              }}
            />
          </a>
        ))}
      </LightGallery>
    </div>
  )
}

export default DetalleGallery
