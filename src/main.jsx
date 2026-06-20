import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import { I18nProvider } from '@/i18n/I18nContext'
import '@/index.css'
import { setupMobileScrollLock } from '@/lib/mobileScrollLock'

// Prevent service worker cache issues in development
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}

// Initialize mobile scroll lock
setupMobileScrollLock();

ReactDOM.createRoot(document.getElementById('root')).render(
  <I18nProvider>
    <App />
  </I18nProvider>
)