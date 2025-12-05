/**
 * Service Worker Registration Utility
 * Registers the service worker and handles updates
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        console.log('🔮 Registering Service Worker...');

        const registration = await navigator.serviceWorker.register(
          '/service-worker.js',
          { scope: '/' }
        );

        console.log('✅ Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 New Service Worker found, installing...');

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.log('🆕 New content available, please refresh!');

                // Show update notification to user
                if (window.confirm('Доступно обновление приложения. Обновить сейчас?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              } else {
                // First install
                console.log('✅ Content cached for offline use');
              }
            }
          });
        });

        // Handle controller change (new SW activated)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            console.log('🔄 Controller changed, reloading...');
            window.location.reload();
          }
        });

        // Periodic sync for background updates (if supported)
        if ('periodicSync' in registration) {
          try {
            await registration.periodicSync.register('sync-readings', {
              minInterval: 24 * 60 * 60 * 1000 // 24 hours
            });
            console.log('✅ Periodic sync registered');
          } catch (error) {
            console.warn('⚠️  Periodic sync not available:', error);
          }
        }

        return registration;
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    });
  } else {
    console.warn('⚠️  Service Workers not supported in this browser');
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('🗑️  Service Worker unregistered');
      })
      .catch((error) => {
        console.error('❌ Error unregistering Service Worker:', error);
      });
  }
}

// Check if app is running in standalone mode (installed PWA)
export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('⚠️  Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// Subscribe to push notifications
export async function subscribeToPush(registration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY || ''
      )
    });

    console.log('✅ Push subscription successful:', subscription);

    // Send subscription to backend
    // await fetch('/api/notifications/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscription)
    // });

    return subscription;
  } catch (error) {
    console.error('❌ Push subscription failed:', error);
    return null;
  }
}

// Helper: Convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Install prompt for PWA
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('🔮 Install prompt available');
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install button
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
  }
});

export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.warn('⚠️  Install prompt not available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  console.log(`🔮 Install prompt outcome: ${outcome}`);
  deferredPrompt = null;

  return outcome === 'accepted';
}

// Track app install
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully');
  deferredPrompt = null;

  // Track installation event
  if (window.gtag) {
    window.gtag('event', 'pwa_install', {
      event_category: 'engagement',
      event_label: 'PWA Installation'
    });
  }
});
