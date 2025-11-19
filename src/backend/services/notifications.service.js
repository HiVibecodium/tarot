/**
 * Notifications Service
 * Управление push-уведомлениями и напоминаниями
 */

const cron = require('node-cron');
const db = require('../db/json-store');

class NotificationsService {
  constructor() {
    this.scheduledJobs = new Map();
    this.isInitialized = false;
  }

  /**
   * Инициализация сервиса уведомлений
   */
  async init() {
    if (this.isInitialized) return;

    console.log('📬 Initializing Notifications Service...');

    // Запускаем ежедневный cron для напоминаний
    // Каждый день в 9:00 по умолчанию
    this.scheduleDailyReminders();

    this.isInitialized = true;
    console.log('✅ Notifications Service initialized');
  }

  /**
   * Планирует ежедневные напоминания
   */
  scheduleDailyReminders() {
    // Запускаем каждый час для проверки настроек пользователей
    const job = cron.schedule('0 * * * *', async () => {
      await this.sendScheduledNotifications();
    });

    this.scheduledJobs.set('daily-reminders', job);
    console.log('⏰ Daily reminders scheduler started');
  }

  /**
   * Отправляет запланированные уведомления
   */
  async sendScheduledNotifications() {
    try {
      const users = await db.find('users', {});
      const now = new Date();
      const currentHour = now.getHours();

      for (const user of users) {
        if (!user.notificationSettings?.enabled) continue;

        const settings = user.notificationSettings;

        // Проверяем daily card reminder
        if (settings.dailyCardReminder?.enabled) {
          const reminderHour = parseInt(settings.dailyCardReminder.time?.split(':')[0]) || 9;

          if (currentHour === reminderHour) {
            await this.sendDailyCardReminder(user);
          }
        }

        // Проверяем weekly reminder (каждый понедельник)
        if (settings.weeklyReminder?.enabled && now.getDay() === 1 && currentHour === 10) {
          await this.sendWeeklyReminder(user);
        }
      }
    } catch (error) {
      console.error('Error sending scheduled notifications:', error);
    }
  }

  /**
   * Отправляет напоминание о карте дня
   */
  async sendDailyCardReminder(user) {
    const notification = {
      title: '🔮 Карта Дня Готова!',
      body: 'Доброе утро! Ваша карта дня ждёт вас',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        url: '/reading/daily',
        type: 'daily-reminder'
      }
    };

    return this.queueNotification(user._id, notification);
  }

  /**
   * Отправляет еженедельное напоминание
   */
  async sendWeeklyReminder(user) {
    const notification = {
      title: '📅 Начало Новой Недели',
      body: 'Сделайте расклад на неделю вперёд',
      icon: '/icons/icon-192x192.png',
      data: {
        url: '/reading/year-ahead',
        type: 'weekly-reminder'
      }
    };

    return this.queueNotification(user._id, notification);
  }

  /**
   * Отправляет уведомление о полнолунии
   */
  async sendFullMoonNotification(user) {
    const notification = {
      title: '🌕 Полнолуние Сегодня!',
      body: 'Лучшее время для раскладов! Энергия на максимуме',
      icon: '/icons/icon-192x192.png',
      data: {
        url: '/moon-calendar',
        type: 'full-moon'
      }
    };

    return this.queueNotification(user._id, notification);
  }

  /**
   * Добавляет уведомление в очередь
   */
  async queueNotification(userId, notification) {
    try {
      // В MVP версии просто логируем
      // В production здесь будет web-push или Firebase Cloud Messaging
      console.log(`📬 Notification queued for user ${userId}:`, notification.title);

      // Сохраняем в историю уведомлений
      await db.insert('notifications', {
        userId,
        notification,
        status: 'queued',
        createdAt: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Error queueing notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Подписывает пользователя на push уведомления
   */
  async subscribe(userId, subscription) {
    try {
      await db.updateOne('users',
        { _id: userId },
        {
          pushSubscription: subscription,
          updatedAt: new Date()
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Отписывает пользователя от push уведомлений
   */
  async unsubscribe(userId) {
    try {
      await db.updateOne('users',
        { _id: userId },
        {
          pushSubscription: null,
          updatedAt: new Date()
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Обновляет настройки уведомлений
   */
  async updateSettings(userId, settings) {
    try {
      await db.updateOne('users',
        { _id: userId },
        {
          notificationSettings: {
            enabled: settings.enabled !== false,
            dailyCardReminder: {
              enabled: settings.dailyCardReminder?.enabled || false,
              time: settings.dailyCardReminder?.time || '09:00'
            },
            weeklyReminder: {
              enabled: settings.weeklyReminder?.enabled || false
            },
            fullMoonAlert: {
              enabled: settings.fullMoonAlert?.enabled || false
            },
            readingCompleted: {
              enabled: settings.readingCompleted?.enabled || false
            }
          },
          updatedAt: new Date()
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Получает настройки уведомлений пользователя
   */
  async getSettings(userId) {
    try {
      const user = await db.findOne('users', { _id: userId });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        data: user.notificationSettings || {
          enabled: true,
          dailyCardReminder: { enabled: false, time: '09:00' },
          weeklyReminder: { enabled: false },
          fullMoonAlert: { enabled: false },
          readingCompleted: { enabled: false }
        }
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Останавливает все scheduled jobs
   */
  shutdown() {
    this.scheduledJobs.forEach((job, name) => {
      job.stop();
      console.log(`⏹️  Stopped job: ${name}`);
    });
    this.scheduledJobs.clear();
  }
}

module.exports = new NotificationsService();
