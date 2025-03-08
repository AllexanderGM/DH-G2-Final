import CardCategories from './CardCategories.jsx'
import './categories.scss'

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
    <div className="categories">
      {list.map((item, index) => (
        <CardCategories key={index} item={item} />
      ))}
    </div>
  )
}

export default Categories
