import { HeroUIProvider } from '@heroui/system'
import { useHref, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

function GeneralContext({ children }) {
  const navigate = useNavigate()
  const hrefFunc = useHref

  return (
    <HeroUIProvider navigate={navigate} useHref={hrefFunc}>
      {children}
    </HeroUIProvider>
  )
}

GeneralContext.propTypes = {
  children: PropTypes.node.isRequired
}

export default GeneralContext
