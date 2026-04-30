import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

// Clerk key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Clerk key is loaded from Vite env; backend baseURL is centralized in src/utils/api.js

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Ensure frontend has the backend base URL configured via Vite env.
if (!import.meta.env.VITE_BASE_URL) {
  throw new Error('Missing VITE_BASE_URL. Set VITE_BASE_URL in .env.local for development or in Vercel project settings for production.')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
)