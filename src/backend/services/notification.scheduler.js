/**
 * Notification Scheduler
 * Handles daily notification scheduling with node-cron
 */

const cron = require('node-cron');
const emailService = require('./email.service');

class NotificationScheduler {
  constructor(db) {
    this.db = db;
    this.jobs = new Map();
    this.init();
  }

  init() {
    console.log('📅 Initializing notification scheduler...');

    // Schedule daily check at different times
    // Run every hour and check for users who need notifications
    cron.schedule('0 * * * *', () => {
      this.checkDailyNotifications();
    });

    console.log('✅ Notification scheduler initialized');
  }

  /**
   * Check and send daily notifications
   */
  async checkDailyNotifications() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    console.log(`🔔 Checking daily notifications at ${currentHour}:${currentMinute}`);

    try {
      // Get all users with notifications enabled
      const users = this.db.getCollection('users');
      const usersToNotify = users.filter(user => {
        if (!user.notificationSettings || !user.notificationSettings.dailyReminder) {
          return false;
        }

        // Check if notification time matches
        const notifTime = user.notificationSettings.reminderTime || '09:00';
        const [notifHour, notifMinute] = notifTime.split(':').map(Number);

        return notifHour === currentHour && Math.abs(notifMinute - currentMinute) < 5;
      });

      console.log(`📬 Found ${usersToNotify.length} users to notify`);

      // Send notifications
      for (const user of usersToNotify) {
        await this.sendDailyNotification(user);
      }
    } catch (error) {
      console.error('❌ Error checking notifications:', error);
    }
  }

  /**
   * Send daily notification to user
   */
  async sendDailyNotification(user) {
    try {
      const settings = user.notificationSettings || {};

      // Check if already notified today
      const lastNotified = user.lastNotified ? new Date(user.lastNotified) : null;
      const today = new Date().toDateString();

      if (lastNotified && lastNotified.toDateString() === today) {
        console.log(`⏭️  User ${user.email} already notified today`);
        return;
      }

      // Check if user already did reading today
      const readings = this.db.getCollection('readings');
      const todayReadings = readings.filter(r => {
        if (r.userId !== user.id || r.type !== 'daily') return false;

        const readingDate = new Date(r.createdAt);
        return readingDate.toDateString() === today;
      });

      if (todayReadings.length > 0) {
        console.log(`✅ User ${user.email} already did reading today`);
        return;
      }

      // Send email notification
      if (settings.emailNotifications !== false) {
        await emailService.sendDailyReminder(user, {
          time: settings.reminderTime || '09:00'
        });
      }

      // Send push notification
      if (settings.pushNotifications && user.pushSubscription) {
        await this.sendPushNotification(user, {
          title: '🔮 Время для расклада Таро!',
          body: 'Узнайте, что звёзды приготовили для вас сегодня',
          icon: '/logo192.png',
          badge: '/logo192.png',
          data: {
            url: '/reading/daily'
          }
        });
      }

      // Update last notified timestamp
      this.db.updateUser(user.id, {
        lastNotified: new Date()
      });

      console.log(`✅ Sent notifications to ${user.email}`);
    } catch (error) {
      console.error(`❌ Failed to notify user ${user.email}:`, error);
    }
  }

  /**
   * Send push notification
   */
  async sendPushNotification(user, notification) {
    if (!user.pushSubscription) {
      return;
    }

    try {
      const webpush = require('web-push');

      // Configure VAPID keys (should be in .env)
      const vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
      };

      if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
        console.warn('⚠️  VAPID keys not configured - push notifications disabled');
        return;
      }

      webpush.setVapidDetails(
        'mailto:support@tarot-assistant.com',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );

      const payload = JSON.stringify(notification);

      await webpush.sendNotification(user.pushSubscription, payload);

      console.log(`📱 Push notification sent to ${user.email}`);
    } catch (error) {
      console.error('❌ Push notification failed:', error);

      // If subscription is invalid, remove it
      if (error.statusCode === 410) {
        this.db.updateUser(user.id, {
          pushSubscription: null
        });
      }
    }
  }

  /**
   * Schedule custom notification
   */
  scheduleNotification(userId, notification, scheduleTime) {
    const jobId = `${userId}-${Date.now()}`;

    const job = cron.schedule(scheduleTime, async () => {
      const user = this.db.getUser(userId);
      if (user) {
        await this.sendDailyNotification(user);
      }

      // Remove job after execution
      this.jobs.delete(jobId);
    });

    this.jobs.set(jobId, job);

    return jobId;
  }

  /**
   * Cancel scheduled notification
   */
  cancelNotification(jobId) {
    const job = this.jobs.get(jobId);

    if (job) {
      job.stop();
      this.jobs.delete(jobId);
      return true;
    }

    return false;
  }

  /**
   * Send streak milestone notification
   */
  async sendStreakMilestone(userId, streak) {
    const user = this.db.getUser(userId);

    if (!user) return;

    // Send email
    await emailService.sendStreakMilestone(user, streak);

    // Send push notification
    if (user.pushSubscription) {
      const milestones = {
        7: '🔥 Неделя подряд!',
        30: '⭐ Месяц подряд!',
        100: '💎 100 дней!',
        365: '👑 Год подряд!'
      };

      const title = milestones[streak];

      if (title) {
        await this.sendPushNotification(user, {
          title,
          body: `Поздравляем! Серия ${streak} дней!`,
          icon: '/logo192.png',
          badge: '/logo192.png',
          data: {
            url: '/achievements'
          }
        });
      }
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll() {
    this.jobs.forEach(job => job.stop());
    this.jobs.clear();
    console.log('🛑 All notification jobs stopped');
  }
}

module.exports = NotificationScheduler;
