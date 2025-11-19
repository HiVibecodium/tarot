/**
 * Email Service
 * Sends email notifications using nodemailer
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.from = process.env.EMAIL_FROM || 'AI Tarot <noreply@tarot-assistant.com>';
    this.init();
  }

  init() {
    // Configure email transporter
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    // In development, use ethereal email for testing
    if (process.env.NODE_ENV === 'development' && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
      console.log('⚠️  No SMTP credentials - Email service in test mode');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport(emailConfig);
      console.log('✅ Email service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error.message);
    }
  }

  /**
   * Send daily reading reminder
   */
  async sendDailyReminder(user, options = {}) {
    const { time = '09:00' } = options;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 Время для расклада Таро!</h1>
          </div>
          <div class="content">
            <p>Привет, ${user.name || 'друг'}!</p>
            <p>Пришло время для вашего ежедневного расклада Таро. Узнайте, что звезды приготовили для вас сегодня!</p>
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/reading/daily" class="button">
                Сделать расклад дня
              </a>
            </p>
            <p>Не забывайте: регулярная практика Таро помогает лучше понимать себя и мир вокруг.</p>
          </div>
          <div class="footer">
            <p>AI Tarot Decision Assistant</p>
            <p>
              <a href="${process.env.FRONTEND_URL}/profile">Настройки уведомлений</a> |
              <a href="${process.env.FRONTEND_URL}/unsubscribe">Отписаться</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: '🔮 Ваш ежедневный расклад Таро готов!',
      html
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #667eea; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 Добро пожаловать в AI Tarot!</h1>
            <p style="font-size: 1.2em; opacity: 0.9;">Начните своё путешествие с Таро</p>
          </div>
          <div class="content">
            <p>Здравствуйте, ${user.name || 'друг'}!</p>
            <p>Спасибо за регистрацию в AI Tarot Decision Assistant! Мы рады приветствовать вас в нашем сообществе.</p>

            <h3>Что вас ждёт:</h3>
            <div class="feature">
              <strong>🌅 Ежедневные расклады</strong> - Начинайте каждый день с мудрости карт
            </div>
            <div class="feature">
              <strong>🎯 Анализ решений</strong> - Получайте помощь в сложных выборах
            </div>
            <div class="feature">
              <strong>📊 Аналитика</strong> - Отслеживайте паттерны и инсайты
            </div>
            <div class="feature">
              <strong>🎓 Обучение</strong> - Изучайте значения карт с нашими квизами
            </div>

            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/reading/daily" class="button">
                Сделать первый расклад
              </a>
            </p>

            <p>Если у вас возникнут вопросы, наша команда поддержки всегда готова помочь!</p>
          </div>
          <div class="footer">
            <p>AI Tarot Decision Assistant</p>
            <p>© 2025 Все права защищены</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: '🔮 Добро пожаловать в AI Tarot!',
      html
    });
  }

  /**
   * Send streak milestone email
   */
  async sendStreakMilestone(user, streak) {
    const milestones = {
      7: { emoji: '🔥', title: 'Неделя!', message: 'Отличное начало!' },
      30: { emoji: '⭐', title: 'Месяц!', message: 'Впечатляющая дисциплина!' },
      100: { emoji: '💎', title: '100 дней!', message: 'Вы — мастер Таро!' },
      365: { emoji: '👑', title: 'Год!', message: 'Легенда Таро!' }
    };

    const milestone = milestones[streak];
    if (!milestone) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 8px; }
          .milestone { font-size: 4em; margin: 20px 0; }
          .streak { font-size: 3em; font-weight: bold; color: #667eea; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="milestone">${milestone.emoji}</div>
            <h1>Поздравляем! ${milestone.title}</h1>
            <p class="streak">${streak} дней подряд!</p>
            <p style="font-size: 1.2em;">${milestone.message}</p>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p>Вы поддерживаете серию ${streak} дней! Это невероятное достижение.</p>
            <p>Продолжайте в том же духе и откройте для себя ещё больше мудрости Таро.</p>
            <a href="${process.env.FRONTEND_URL}/achievements" class="button">
              Посмотреть достижения
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `${milestone.emoji} Серия ${streak} дней! ${milestone.title}`,
      html
    });
  }

  /**
   * Send generic email
   */
  async sendEmail({ to, subject, html, text }) {
    if (!this.transporter) {
      console.log('📧 Email (test mode):', subject, 'to:', to);
      return { success: true, messageId: 'test-mode' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
        text: text || this.htmlToText(html)
      });

      console.log('✅ Email sent:', info.messageId);

      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('❌ Email send failed:', error.message);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Convert HTML to plain text (simple version)
   */
  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Send Premium welcome email
   */
  async sendPremiumWelcome(user, subscription) {
    const emailTemplates = require('./email-templates');
    const template = emailTemplates.premiumWelcome(user, subscription);
    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  }

  /**
   * Send Premium cancellation email
   */
  async sendPremiumCanceled(user, subscription) {
    const emailTemplates = require('./email-templates');
    const template = emailTemplates.premiumCanceled(user, subscription);
    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  }

  /**
   * Send payment failed notification
   */
  async sendPaymentFailed(user, invoice) {
    const emailTemplates = require('./email-templates');
    const template = emailTemplates.paymentFailed(user, invoice);
    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  }

  /**
   * Send payment succeeded confirmation
   */
  async sendPaymentSucceeded(user, invoice) {
    const emailTemplates = require('./email-templates');
    const template = emailTemplates.paymentSucceeded(user, invoice);
    return this.sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html
    });
  }

  /**
   * Verify transporter connection
   */
  async verify() {
    if (!this.transporter) {
      return { success: false, error: 'No transporter configured' };
    }

    try {
      await this.transporter.verify();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
module.exports = new EmailService();
