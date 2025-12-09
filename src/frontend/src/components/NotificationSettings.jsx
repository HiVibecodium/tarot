import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './NotificationSettings.css';

// Конвертация VAPID ключа для подписки
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

const NotificationSettings = () => {
  const { token } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState({
    enabled: true,
    dailyCardReminder: { enabled: false, time: '09:00' },
    weeklyReminder: { enabled: false },
    fullMoonAlert: { enabled: false },
    readingCompleted: { enabled: false }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState('default');
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const checkExistingSubscription = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setPushSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  }, []);

  useEffect(() => {
    checkPushSupport();
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPushSupport = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
      await checkExistingSubscription();
    }
  };

  const loadSettings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/settings`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/settings`,
        settings,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Настройки сохранены!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const requestPermission = async () => {
    if (!pushSupported) {
      alert('Ваш браузер не поддерживает push-уведомления');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission === 'granted') {
        // Подписываемся на push
        await subscribeToPush();
      } else {
        alert('Уведомления заблокированы. Разрешите их в настройках браузера.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      alert('Ошибка при запросе разрешения');
    }
  };

  const subscribeToPush = async () => {
    setSubscribing(true);
    try {
      // Получаем VAPID ключ с сервера
      const vapidResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/vapid`
      );

      if (!vapidResponse.data.success) {
        throw new Error('VAPID key not available');
      }

      const vapidPublicKey = vapidResponse.data.data.publicKey;

      // Получаем registration Service Worker
      const registration = await navigator.serviceWorker.ready;

      // Подписываемся на push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Отправляем подписку на сервер
      await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/subscribe`,
        { subscription: subscription.toJSON() },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPushSubscribed(true);
      alert('Push-уведомления включены!');
    } catch (error) {
      console.error('Error subscribing to push:', error);
      alert('Ошибка при подписке на уведомления: ' + error.message);
    } finally {
      setSubscribing(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setSubscribing(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      // Уведомляем сервер
      await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/unsubscribe`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPushSubscribed(false);
      alert('Push-уведомления отключены');
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Ошибка при отключении уведомлений');
    } finally {
      setSubscribing(false);
    }
  };

  const sendTestNotification = async () => {
    if (pushPermission !== 'granted') {
      alert('Сначала разрешите уведомления');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/test`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Показать локальное уведомление
      new Notification('🔮 Таро Помощник', {
        body: 'Уведомления работают отлично!',
        icon: '/icons/icon-192x192.png'
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const updateSetting = (path, value) => {
    const newSettings = { ...settings };
    const keys = path.split('.');
    let current = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return <div className="notification-settings loading">Загрузка настроек...</div>;
  }

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h3>🔔 Настройки Уведомлений</h3>
        <p>Настройте напоминания и оповещения</p>
      </div>

      {!pushSupported && (
        <div className="push-warning">
          ⚠️ Ваш браузер не поддерживает push-уведомления
        </div>
      )}

      {pushSupported && pushPermission === 'denied' && (
        <div className="push-warning">
          ⚠️ Уведомления заблокированы в настройках браузера
        </div>
      )}

      {pushSupported && pushPermission === 'default' && (
        <div className="push-request">
          <button
            onClick={requestPermission}
            className="permission-btn"
            disabled={subscribing}
          >
            {subscribing ? 'Подключение...' : '🔔 Включить Push-уведомления'}
          </button>
        </div>
      )}

      {pushSupported && pushPermission === 'granted' && !pushSubscribed && (
        <div className="push-request">
          <button
            onClick={subscribeToPush}
            className="permission-btn"
            disabled={subscribing}
          >
            {subscribing ? 'Подключение...' : '🔔 Подписаться на уведомления'}
          </button>
        </div>
      )}

      {pushSupported && pushPermission === 'granted' && pushSubscribed && (
        <div className="push-success">
          <span>✅ Push-уведомления активны</span>
          <div className="push-actions">
            <button onClick={sendTestNotification} className="test-btn">
              Тест
            </button>
            <button
              onClick={unsubscribeFromPush}
              className="unsubscribe-btn"
              disabled={subscribing}
            >
              Отключить
            </button>
          </div>
        </div>
      )}

      <div className="settings-section">
        <label className="setting-item">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => updateSetting('enabled', e.target.checked)}
          />
          <div className="setting-info">
            <strong>Включить уведомления</strong>
            <p>Мастер-переключатель для всех уведомлений</p>
          </div>
        </label>
      </div>

      {settings.enabled && (
        <>
          <div className="settings-section">
            <h4>⏰ Ежедневные Напоминания</h4>

            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.dailyCardReminder?.enabled}
                onChange={(e) => updateSetting('dailyCardReminder.enabled', e.target.checked)}
              />
              <div className="setting-info">
                <strong>Напоминание о карте дня</strong>
                <p>Получайте напоминание вытянуть карту дня</p>
              </div>
            </label>

            {settings.dailyCardReminder?.enabled && (
              <div className="time-picker">
                <label>Время напоминания:</label>
                <input
                  type="time"
                  value={settings.dailyCardReminder.time}
                  onChange={(e) => updateSetting('dailyCardReminder.time', e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="settings-section">
            <h4>📅 Еженедельные Напоминания</h4>

            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.weeklyReminder?.enabled}
                onChange={(e) => updateSetting('weeklyReminder.enabled', e.target.checked)}
              />
              <div className="setting-info">
                <strong>Напоминание о раскладе на неделю</strong>
                <p>Каждый понедельник в 10:00</p>
              </div>
            </label>
          </div>

          <div className="settings-section">
            <h4>🌕 Особые События</h4>

            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.fullMoonAlert?.enabled}
                onChange={(e) => updateSetting('fullMoonAlert.enabled', e.target.checked)}
              />
              <div className="setting-info">
                <strong>Оповещения о полнолунии</strong>
                <p>Уведомление в дни полнолуния - лучшее время для раскладов</p>
              </div>
            </label>

            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.readingCompleted?.enabled}
                onChange={(e) => updateSetting('readingCompleted.enabled', e.target.checked)}
              />
              <div className="setting-info">
                <strong>Уведомления о завершении расклада</strong>
                <p>Когда расклад готов к просмотру</p>
              </div>
            </label>
          </div>
        </>
      )}

      <div className="settings-actions">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="save-btn"
        >
          {saving ? 'Сохранение...' : 'Сохранить Настройки'}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
