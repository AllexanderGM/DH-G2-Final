import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import GeneralContext from './context/GeneralContext.jsx'
import App from './App.jsx'

// Estilos con Tailwind CSS
import './styles/tailwind.css'
// Estilos generales Styles
import './styles/global.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GeneralContext>
        <App />
      </GeneralContext>
    </BrowserRouter>
  </StrictMode>
)
