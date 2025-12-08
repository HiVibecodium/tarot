import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './NotificationSettings.css';

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

  useEffect(() => {
    checkPushSupport();
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPushSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
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
        alert('Уведомления разрешены!');
        // В production здесь будет подписка на push
      } else {
        alert('Уведомления заблокированы');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
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
          <button onClick={requestPermission} className="permission-btn">
            🔔 Разрешить Уведомления
          </button>
        </div>
      )}

      {pushSupported && pushPermission === 'granted' && (
        <div className="push-success">
          ✅ Уведомления разрешены
          <button onClick={sendTestNotification} className="test-btn">
            Тест
          </button>
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
