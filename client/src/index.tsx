import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Router } from 'routes'
import { AuthContextProvider } from 'contetxs'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <Router />
    </AuthContextProvider>
  </StrictMode>
)
