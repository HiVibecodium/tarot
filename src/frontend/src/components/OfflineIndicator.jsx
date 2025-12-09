import { useState, useEffect } from 'react'
import './OfflineIndicator.css'

/**
 * Offline Indicator component
 * Shows a banner when the user is offline
 */
function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOffline, setShowOffline] = useState(false)
  const [showBackOnline, setShowBackOnline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOffline(false)
      setShowBackOnline(true)

      // Hide "back online" message after 3 seconds
      setTimeout(() => {
        setShowBackOnline(false)
      }, 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOffline(true)
      setShowBackOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Initial check
    if (!navigator.onLine) {
      setShowOffline(true)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showOffline && !showBackOnline) {
    return null
  }

  return (
    <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
      {!isOnline && (
        <>
          <span className="offline-icon">📡</span>
          <span className="offline-text">
            Нет подключения к интернету. Некоторые функции недоступны.
          </span>
        </>
      )}
      {showBackOnline && (
        <>
          <span className="offline-icon">✅</span>
          <span className="offline-text">
            Подключение восстановлено!
          </span>
        </>
      )}
    </div>
  )
}

export default OfflineIndicator
