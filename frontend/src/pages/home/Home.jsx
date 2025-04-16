import { SearchProvider } from '@context/SearchContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Hero from './components/Hero.jsx'
import Categories from './components/Categories.jsx'
import Body from './components/Body.jsx'
import SuccessBookingBanner from './components/SuccessBookingBanner.jsx'

import './home.scss'

const HomePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [shouldRender, setShouldRender] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    // Si hay un mensaje de éxito en el estado de la navegación
    if (location.state?.success) {
      setShouldRender(true)
      setSuccessMessage(location.state.message)
      // Limpiamos el estado de la navegación
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const handleCloseBanner = () => {
    setShouldRender(false)
    setSuccessMessage(null)
  }

  return (
    <SearchProvider>
      {shouldRender && <SuccessBookingBanner message={successMessage} onClose={handleCloseBanner} />}

      <Hero />
      <div className="home_categories-container">
        <Categories />
        <Body />
      </div>
    </SearchProvider>
  )
}

export default HomePage
