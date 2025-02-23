import { Image } from '@heroui/react'
import LightGallery from 'lightgallery/react'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

// prettier-ignore

const DetalleGallery = ({ tour }) => {

const pseudoGallery = tour
    ? [
      {
        imageId: 1,
        src: tour.imagenes[0]
      },
      {
        imageId: 2,
        src: 'https://images.unsplash.com/photo-1546863340-7e4e97e46f42?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWNvbmNhZ3VhfGVufDB8fDB8fHww'
      },
      {
        imageId: 3,
        src: 'https://images.unsplash.com/photo-1483631224226-a219224bb76e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWNvbmNhZ3VhfGVufDB8fDB8fHww'
      },
      {
        imageId: 4,
        src: 'https://images.unsplash.com/photo-1598313795136-a202370958af?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        imageId: 5,
        src: 'https://images.unsplash.com/photo-1504359147064-a13220c2ea38?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    ]
    : []

  return (
    <div className="grid grid-flow-row grid-cols-2 md:grid-flow-col md:grid-cols-3 md:grid-rows-2 gap-1 md:h-[400px] mb-10">
      {pseudoGallery.map((image, index) => (
        <div key={image.imageId} className={`overflow-hidden flex justify-center items-center w-full first:row-span-2`}>
          <Image
            src={image.src}
            classNames={{
              wrapper: `w-full ${index === 0 && 'h-full'}`,
              img: `w-full ${index === 0 && 'h-full rounded-none rounded-tl-xl rounded-bl-xl'} object-cover`
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default DetalleGallery
