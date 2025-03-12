import { SearchProvider } from '@context/SearchContext.jsx'

import Hero from './components/Hero.jsx'
import Categories from './components/Categories.jsx'
import Body from './components/Body.jsx'

import './home.scss'

const HomePage = () => {
  return (
    <SearchProvider>
      <Hero />
      <div className="home_categories-container">
        <Categories />
        <Body />
      </div>
    </SearchProvider>
  )
}

export default HomePage
