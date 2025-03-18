import { HeroUIProvider } from '@heroui/react'
import { useHref, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

function GeneralContext({ children }) {
  const navigate = useNavigate()

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref} locale="es-ES">
      {children}
    </HeroUIProvider>
  )
}

GeneralContext.propTypes = {
  children: PropTypes.node.isRequired
}

export default GeneralContext
