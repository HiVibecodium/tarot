const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const notificationsService = require('../services/notifications.service');

/**
 * GET /api/notifications/vapid
 * Получить публичный VAPID ключ для подписки на push
 */
router.get('/vapid', (req, res) => {
  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY || null;

    if (!publicKey) {
      return res.status(503).json({
        success: false,
        message: 'Push notifications not configured'
      });
    }

    res.json({
      success: true,
      data: { publicKey }
    });
  } catch (error) {
    console.error('VAPID endpoint error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * POST /api/notifications/subscribe
 * Подписаться на push уведомления
 */
router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'Subscription data is required'
      });
    }

    await notificationsService.subscribe(req.user.userId, subscription);

    res.json({
      success: true,
      message: 'Successfully subscribed to notifications'
    });
  } catch (error) {
    console.error('Subscribe to notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при подписке на уведомления'
    });
  }
});

/**
 * POST /api/notifications/unsubscribe
 * Отписаться от push уведомлений
 */
router.post('/unsubscribe', authenticate, async (req, res) => {
  try {
    await notificationsService.unsubscribe(req.user.userId);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from notifications'
    });
  } catch (error) {
    console.error('Unsubscribe from notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отписке от уведомлений'
    });
  }
});

/**
 * PUT /api/notifications/settings
 * Обновить настройки уведомлений
 */
router.put('/settings', authenticate, async (req, res) => {
  try {
    const settings = req.body;

    const result = await notificationsService.updateSettings(req.user.userId, settings);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error
      });
    }

    res.json({
      success: true,
      message: 'Настройки уведомлений обновлены'
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении настроек'
    });
  }
});

/**
 * GET /api/notifications/settings
 * Получить настройки уведомлений
 */
router.get('/settings', authenticate, async (req, res) => {
  try {
    const result = await notificationsService.getSettings(req.user.userId);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.error
      });
    }

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении настроек'
    });
  }
});

/**
 * POST /api/notifications/test
 * Отправить тестовое уведомление
 */
router.post('/test', authenticate, async (req, res) => {
  try {
    const notification = {
      title: '🔮 Тестовое Уведомление',
      body: 'Уведомления работают отлично!',
      icon: '/icons/icon-192x192.png',
      data: {
        url: '/dashboard',
        type: 'test'
      }
    };

    await notificationsService.queueNotification(req.user.userId, notification);

    res.json({
      success: true,
      message: 'Тестовое уведомление отправлено'
    });
  } catch (error) {
    console.error('Send test notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке тестового уведомления'
    });
  }
});

module.exports = router;
