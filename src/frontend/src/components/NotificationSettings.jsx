import { useState, useEffect } from 'react'
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribedToPush,
  getDailyReminderSettings,
  scheduleDailyReminder,
  disableDailyReminder
} from '../services/pushNotifications'
import './NotificationSettings.css'

function NotificationSettings() {
  const [permission, setPermission] = useState('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [reminderSettings, setReminderSettings] = useState({ enabled: false, hour: 9 })
  const [loading, setLoading] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    // Check support and current state
    setSupported(isPushSupported())
    setPermission(getNotificationPermission())
    setReminderSettings(getDailyReminderSettings())

    // Check subscription status
    isSubscribedToPush().then(setIsSubscribed)
  }, [])

  const handleEnableNotifications = async () => {
    setLoading(true)

    // Request permission first
    const { success, permission: newPermission } = await requestNotificationPermission()
    setPermission(newPermission)

    if (success) {
      // Subscribe to push
      const result = await subscribeToPush()
      setIsSubscribed(result.success)
    }

    setLoading(false)
  }

  const handleDisableNotifications = async () => {
    setLoading(true)
    await unsubscribeFromPush()
    setIsSubscribed(false)
    disableDailyReminder()
    setReminderSettings({ ...reminderSettings, enabled: false })
    setLoading(false)
  }

  const handleReminderToggle = () => {
    if (reminderSettings.enabled) {
      disableDailyReminder()
      setReminderSettings({ ...reminderSettings, enabled: false })
    } else {
      const settings = scheduleDailyReminder(reminderSettings.hour, 0)
      setReminderSettings(settings)
    }
  }

  const handleTimeChange = (e) => {
    const hour = parseInt(e.target.value)
    const settings = scheduleDailyReminder(hour, 0)
    setReminderSettings(settings)
  }

  if (!supported) {
    return (
      <div className="notification-settings">
        <div className="notification-unsupported">
          <span className="notification-icon">🔕</span>
          <p>Push-уведомления не поддерживаются в вашем браузере</p>
        </div>
      </div>
    )
  }

  return (
    <div className="notification-settings">
      <h3 className="notification-title">
        <span className="notification-icon">🔔</span>
        Уведомления
      </h3>

      {permission === 'denied' ? (
        <div className="notification-denied">
          <p>Уведомления заблокированы в настройках браузера.</p>
          <p className="notification-hint">
            Разрешите уведомления в настройках браузера, чтобы получать напоминания.
          </p>
        </div>
      ) : (
        <>
          <div className="notification-toggle-row">
            <div className="toggle-info">
              <span className="toggle-label">Push-уведомления</span>
              <span className="toggle-description">
                Получайте напоминания о раскладах
              </span>
            </div>
            <button
              className={`toggle-button ${isSubscribed ? 'active' : ''}`}
              onClick={isSubscribed ? handleDisableNotifications : handleEnableNotifications}
              disabled={loading}
            >
              {loading ? '...' : isSubscribed ? 'Вкл' : 'Выкл'}
            </button>
          </div>

          {isSubscribed && (
            <div className="reminder-settings">
              <div className="notification-toggle-row">
                <div className="toggle-info">
                  <span className="toggle-label">Ежедневное напоминание</span>
                  <span className="toggle-description">
                    Напомним о карте дня
                  </span>
                </div>
                <button
                  className={`toggle-button ${reminderSettings.enabled ? 'active' : ''}`}
                  onClick={handleReminderToggle}
                >
                  {reminderSettings.enabled ? 'Вкл' : 'Выкл'}
                </button>
              </div>

              {reminderSettings.enabled && (
                <div className="time-selector">
                  <label className="time-label">Время напоминания:</label>
                  <select
                    value={reminderSettings.hour}
                    onChange={handleTimeChange}
                    className="time-select"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default NotificationSettings
