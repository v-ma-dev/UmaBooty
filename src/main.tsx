import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TablePage from './TablePage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TablePage />
  </StrictMode>,
)
