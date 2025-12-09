/**
 * Notifications Service
 * Управление push-уведомлениями и напоминаниями
 */

const cron = require('node-cron');
const webpush = require('web-push');
const db = require('../db');
const moonPhasesService = require('./moon-phases.service');

class NotificationsService {
  constructor() {
    this.scheduledJobs = new Map();
    this.isInitialized = false;
    this.vapidConfigured = false;
  }

  /**
   * Конфигурирует VAPID для Web Push
   */
  configureVapid() {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const email = process.env.VAPID_EMAIL || 'mailto:support@tarot-assistant.com';

    if (!publicKey || !privateKey) {
      console.warn('⚠️ VAPID keys not configured - push notifications disabled');
      console.warn('   Generate keys with: npx web-push generate-vapid-keys');
      return false;
    }

    try {
      webpush.setVapidDetails(email, publicKey, privateKey);
      this.vapidConfigured = true;
      console.log('✅ VAPID configured for push notifications');
      return true;
    } catch (error) {
      console.error('❌ Failed to configure VAPID:', error.message);
      return false;
    }
  }

  /**
   * Получает публичный VAPID ключ для фронтенда
   */
  getPublicVapidKey() {
    return process.env.VAPID_PUBLIC_KEY || null;
  }

  /**
   * Инициализация сервиса уведомлений
   */
  async init() {
    if (this.isInitialized) return;

    console.log('📬 Initializing Notifications Service...');

    // Конфигурируем VAPID
    this.configureVapid();

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

    // Проверяем полнолуние каждый день в 10:00
    const moonJob = cron.schedule('0 10 * * *', async () => {
      await this.checkAndSendMoonNotifications();
    });

    this.scheduledJobs.set('moon-alerts', moonJob);

    console.log('⏰ Daily reminders scheduler started');
    console.log('🌕 Moon phase notifications scheduled');
  }

  /**
   * Проверяет и отправляет уведомления о полнолунии
   */
  async checkAndSendMoonNotifications() {
    try {
      const phase = moonPhasesService.calculateMoonPhase(new Date());

      if (phase.phaseName === 'Полнолуние') {
        console.log('🌕 Full moon detected! Sending notifications...');

        const users = await db.find('users', {
          'notificationSettings.fullMoonAlert.enabled': true
        });

        for (const user of users) {
          if (user.pushSubscription) {
            await this.sendFullMoonNotification(user);
          }
        }

        console.log(`📬 Sent full moon notifications to ${users.length} users`);
      }
    } catch (error) {
      console.error('Error checking moon notifications:', error);
    }
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
   * Отправляет push-уведомление пользователю
   */
  async sendPushToUser(userId, notification) {
    if (!this.vapidConfigured) {
      console.warn('⚠️ Cannot send push - VAPID not configured');
      return { success: false, error: 'VAPID not configured' };
    }

    try {
      const user = await db.findOne('users', { _id: userId });

      if (!user?.pushSubscription) {
        console.log(`⏭️ User ${userId} has no push subscription`);
        return { success: false, error: 'No subscription' };
      }

      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/logo192.png',
        badge: notification.badge || '/logo192.png',
        data: notification.data || {}
      });

      await webpush.sendNotification(user.pushSubscription, payload);

      console.log(`📱 Push sent to user ${userId}: ${notification.title}`);

      // Сохраняем в историю
      await db.insertOne('notifications', {
        userId,
        notification,
        status: 'sent',
        sentAt: new Date(),
        createdAt: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Push notification failed:', error.message);

      // Если подписка невалидна (410 Gone), удаляем её
      if (error.statusCode === 410 || error.statusCode === 404) {
        console.log(`🗑️ Removing invalid subscription for user ${userId}`);
        await this.unsubscribe(userId);
      }

      return { success: false, error: error.message };
    }
  }

  /**
   * Добавляет уведомление в очередь и отправляет
   */
  async queueNotification(userId, notification) {
    try {
      console.log(`📬 Processing notification for user ${userId}:`, notification.title);

      // Пытаемся отправить push
      const pushResult = await this.sendPushToUser(userId, notification);

      // Сохраняем в историю уведомлений (если push не отправлен)
      if (!pushResult.success) {
        await db.insertOne('notifications', {
          userId,
          notification,
          status: 'queued',
          error: pushResult.error,
          createdAt: new Date()
        });
      }

      return { success: true, pushSent: pushResult.success };
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
