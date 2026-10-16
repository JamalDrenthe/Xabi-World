import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './lib/language'
import { AuthProvider } from './lib/auth-context'
import { FinancialProvider } from './lib/financial-store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FinancialProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </FinancialProvider>
    </AuthProvider>
  </StrictMode>,
)
