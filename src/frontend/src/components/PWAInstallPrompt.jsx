import { useState, useEffect } from 'react'
import './PWAInstallPrompt.css'

/**
 * PWA Install Prompt component
 * Shows a banner prompting users to install the app on their device
 */
function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        return // Don't show for 7 days after dismissal
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Show prompt after a delay (let user explore the app first)
      setTimeout(() => {
        setShowPrompt(true)
      }, 30000) // 30 seconds
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      localStorage.removeItem('pwa-prompt-dismissed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  // Don't render if installed or not ready to show
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-prompt-content">
        <div className="pwa-prompt-icon">
          <span>🔮</span>
        </div>
        <div className="pwa-prompt-text">
          <h4>Установите приложение</h4>
          <p>Быстрый доступ к раскладам прямо с главного экрана</p>
        </div>
        <div className="pwa-prompt-actions">
          <button onClick={handleInstall} className="pwa-btn-install">
            Установить
          </button>
          <button onClick={handleDismiss} className="pwa-btn-dismiss">
            Позже
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt
