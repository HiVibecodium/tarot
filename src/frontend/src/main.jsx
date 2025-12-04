import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import { store } from './store/store'
import { initSentry, SentryErrorBoundary } from './config/sentry'
import { registerServiceWorker } from './utils/registerServiceWorker'
import analytics from './utils/analytics'
import { initWebVitals } from './utils/webVitals'
import './utils/logger' // Import logger to suppress console in production
import App from './App'
import './index.css'
import './styles/theme.css'
import './styles/animations.css'
import './styles/mobile.css'
import './styles/responsive.css'
import './styles/accessibility.css'

// Initialize Sentry (must be before rendering)
initSentry()

// Initialize Analytics (GA4 + Yandex.Metrika)
analytics.init({
  ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
  yandexMetrikaId: import.meta.env.VITE_YM_COUNTER_ID,
  enableInDev: false // Only track in production
})

// Initialize Web Vitals monitoring
if (import.meta.env.PROD) {
  initWebVitals()
}

// Register Service Worker for PWA functionality
if (import.meta.env.PROD) {
  registerServiceWorker()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>⚠️ Что-то пошло не так</h2>
          <p>Произошла ошибка. Мы уже работаем над её исправлением.</p>
          <button onClick={resetError} style={{ padding: '10px 20px', marginTop: '10px' }}>
            Попробовать снова
          </button>
          {import.meta.env.MODE === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Детали ошибки (development)</summary>
              <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                {error.toString()}
              </pre>
            </details>
          )}
        </div>
      )}
    >
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </SentryErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>,
)
