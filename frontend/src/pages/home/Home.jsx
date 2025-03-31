import { SearchProvider } from '@context/SearchContext.jsx'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

import Hero from './components/Hero.jsx'
import Categories from './components/Categories.jsx'
import Body from './components/Body.jsx'
import SuccessBookingBanner from './components/SuccessBookingBanner.jsx'

import './home.scss'

const HomePage = () => {
  const location = useLocation()
  const [shouldRender, setShouldRender] = useState(location.state?.success || false)
  const successMessage = location.state?.message

  return (
    <SearchProvider>
      {shouldRender && <SuccessBookingBanner message={successMessage} onClose={() => setShouldRender(false)} />}

      <Hero />
      <div className="home_categories-container">
        <Categories />
        <Body />
      </div>
    </SearchProvider>
  )
}

export default HomePage
