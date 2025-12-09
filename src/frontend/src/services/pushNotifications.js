/**
 * Push Notifications Service
 * Handles subscription, permissions, and sending notifications
 */

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''

/**
 * Check if push notifications are supported
 */
export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

/**
 * Check current notification permission
 */
export function getNotificationPermission() {
  if (!('Notification' in window)) {
    return 'unsupported'
  }
  return Notification.permission
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return { success: false, permission: 'unsupported' }
  }

  try {
    const permission = await Notification.requestPermission()
    return { success: permission === 'granted', permission }
  } catch (error) {
    console.error('Error requesting notification permission:', error)
    return { success: false, permission: 'denied', error }
  }
}

/**
 * Subscribe user to push notifications
 */
export async function subscribeToPush() {
  if (!isPushSupported()) {
    return { success: false, error: 'Push not supported' }
  }

  try {
    const registration = await navigator.serviceWorker.ready

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })
    }

    // Save subscription to localStorage
    localStorage.setItem('push-subscription', JSON.stringify(subscription))

    return { success: true, subscription }
  } catch (error) {
    console.error('Error subscribing to push:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      localStorage.removeItem('push-subscription')
    }

    return { success: true }
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if user is subscribed to push
 */
export async function isSubscribedToPush() {
  if (!isPushSupported()) return false

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return !!subscription
  } catch {
    return false
  }
}

/**
 * Show a local notification (no server needed)
 */
export async function showLocalNotification(title, options = {}) {
  if (getNotificationPermission() !== 'granted') {
    return { success: false, error: 'Permission not granted' }
  }

  try {
    const registration = await navigator.serviceWorker.ready

    await registration.showNotification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      tag: 'tarot-notification',
      ...options
    })

    return { success: true }
  } catch (error) {
    console.error('Error showing notification:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Schedule daily reading reminder
 */
export function scheduleDailyReminder(hour = 9, minute = 0) {
  const settings = {
    enabled: true,
    hour,
    minute,
    lastShown: null
  }

  localStorage.setItem('daily-reminder', JSON.stringify(settings))
  return settings
}

/**
 * Get daily reminder settings
 */
export function getDailyReminderSettings() {
  const saved = localStorage.getItem('daily-reminder')
  if (saved) {
    return JSON.parse(saved)
  }
  return { enabled: false, hour: 9, minute: 0, lastShown: null }
}

/**
 * Disable daily reminder
 */
export function disableDailyReminder() {
  const settings = getDailyReminderSettings()
  settings.enabled = false
  localStorage.setItem('daily-reminder', JSON.stringify(settings))
}

/**
 * Check and show daily reminder if needed
 */
export async function checkDailyReminder() {
  const settings = getDailyReminderSettings()

  if (!settings.enabled) return

  const now = new Date()
  const today = now.toDateString()

  // Already shown today
  if (settings.lastShown === today) return

  // Check if it's time
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  if (currentHour >= settings.hour && currentMinute >= settings.minute) {
    // Check if user already did daily reading
    const dailyReading = localStorage.getItem(`daily-reading-${today}`)

    if (!dailyReading) {
      await showLocalNotification('Время для расклада дня!', {
        body: 'Узнайте, что приготовил для вас сегодняшний день',
        data: { url: '/reading/daily' },
        actions: [
          { action: 'open', title: 'Открыть' },
          { action: 'close', title: 'Позже' }
        ]
      })

      // Mark as shown
      settings.lastShown = today
      localStorage.setItem('daily-reminder', JSON.stringify(settings))
    }
  }
}

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  if (!base64String) {
    return new Uint8Array()
  }

  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export default {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribedToPush,
  showLocalNotification,
  scheduleDailyReminder,
  getDailyReminderSettings,
  disableDailyReminder,
  checkDailyReminder
}
