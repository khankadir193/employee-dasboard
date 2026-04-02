import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/App.jsx'
import './styles/global.css'

const rootEl = document.getElementById('app')
if (!rootEl) {
  throw new Error('Root element with id="app" not found')
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

