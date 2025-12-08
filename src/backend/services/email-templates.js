/**
 * Email Templates for AI Tarot Decision Assistant
 * Beautiful, responsive HTML email templates
 */

const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  white: '#ffffff',
  gray: '#6b7280',
  lightGray: '#f3f4f6'
};

/**
 * Base HTML wrapper for all emails
 */
const emailWrapper = (content) => `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Tarot Decision Assistant</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: ${colors.lightGray};
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${colors.white};
    }
    .header {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .header-title {
      color: ${colors.white};
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
      color: ${colors.white};
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }
    .feature-list li {
      padding: 10px 0;
      padding-left: 30px;
      position: relative;
    }
    .feature-list li:before {
      content: '✨';
      position: absolute;
      left: 0;
    }
    .footer {
      background-color: ${colors.lightGray};
      padding: 30px;
      text-align: center;
      color: ${colors.gray};
      font-size: 14px;
    }
    .divider {
      border: 0;
      height: 1px;
      background-color: ${colors.lightGray};
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">🔮</div>
      <h1 class="header-title">AI Tarot Decision Assistant</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Это автоматическое письмо от AI Tarot Decision Assistant</p>
      <p>
        <a href="https://ai-tarot-assistant.vercel.app" style="color: ${colors.primary}; text-decoration: none;">
          Перейти к приложению
        </a>
      </p>
      <p style="font-size: 12px; color: ${colors.gray};">
        © 2025 AI Tarot Decision Assistant. Все права защищены.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Welcome email for new Premium subscribers
 */
const premiumWelcome = (user, subscription) => {
  const content = `
    <h2 style="color: ${colors.primary}; margin-top: 0;">
      🎉 Добро пожаловать в Premium!
    </h2>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Здравствуйте, <strong>${user.displayName}</strong>!
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Спасибо за подписку на Premium план AI Tarot Decision Assistant.
      Теперь вам доступны все возможности для глубокого самопознания и принятия мудрых решений.
    </p>

    <hr class="divider">

    <h3 style="color: ${colors.primary};">✨ Ваши новые возможности:</h3>

    <ul class="feature-list">
      <li><strong>Неограниченные расклады</strong> — вытягивайте столько карт, сколько нужно</li>
      <li><strong>Полная колода из 78 карт</strong> — Старшие и Младшие Арканы</li>
      <li><strong>Специальные расклады</strong> — Кельтский крест, Годовой расклад и др.</li>
      <li><strong>Расширенная аналитика</strong> — глубокая статистика ваших раскладов</li>
      <li><strong>Натальная карта</strong> — персональные астрологические insights</li>
      <li><strong>Экспорт в PDF</strong> — сохраняйте важные расклады</li>
      <li><strong>История без ограничений</strong> — доступ ко всем прошлым раскладам</li>
    </ul>

    <hr class="divider">

    <div style="text-align: center;">
      <a href="https://ai-tarot-assistant.vercel.app/reading/daily" class="button">
        Вытянуть первую карту 🔮
      </a>
    </div>

    <hr class="divider">

    <p style="font-size: 14px; color: ${colors.gray};">
      <strong>Детали подписки:</strong><br>
      Статус: <span style="color: ${colors.success};">Активна</span><br>
      План: Premium Monthly<br>
      Следующее списание: ${subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('ru-RU') : 'N/A'}
    </p>

    <p style="font-size: 14px; color: ${colors.gray};">
      Вы можете управлять подпиской в любое время в настройках вашего аккаунта.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray}; margin-top: 30px;">
      Желаем вам мудрости и ясности на вашем пути! 🌟
    </p>
  `;

  return {
    subject: '🎉 Добро пожаловать в AI Tarot Premium!',
    html: emailWrapper(content)
  };
};

/**
 * Subscription cancellation email
 */
const premiumCanceled = (user, _subscription) => {
  const content = `
    <h2 style="color: ${colors.gray}; margin-top: 0;">
      👋 Ваша Premium подписка отменена
    </h2>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Здравствуйте, <strong>${user.displayName}</strong>,
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Жаль, что вы решили отменить Premium подписку. Ваша подписка была успешно отменена.
    </p>

    <hr class="divider">

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      <strong>Что это значит:</strong>
    </p>

    <ul style="color: ${colors.gray}; line-height: 1.8;">
      <li>Вы продолжаете иметь доступ к Premium функциям до конца оплаченного периода</li>
      <li>Автоматическое продление отключено — новых списаний не будет</li>
      <li>После окончания периода вы вернётесь к базовому плану</li>
    </ul>

    <hr class="divider">

    <h3 style="color: ${colors.primary};">🆓 Базовый план всё ещё включает:</h3>

    <ul class="feature-list">
      <li>Ежедневный расклад Таро</li>
      <li>Базовую колоду из 22 Старших Арканов</li>
      <li>Историю последних 30 дней</li>
      <li>Основную аналитику</li>
    </ul>

    <hr class="divider">

    <p style="font-size: 14px; color: ${colors.gray}; background-color: ${colors.lightGray}; padding: 15px; border-radius: 8px;">
      💡 <strong>Совет:</strong> Вы можете в любой момент вернуться к Premium плану и продолжить с того места, где остановились. Все ваши данные и история сохранены.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://ai-tarot-assistant.vercel.app/settings" class="button">
        Вернуться к Premium
      </a>
    </div>

    <hr class="divider">

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray}; margin-top: 30px;">
      Спасибо, что были с нами! Мы всегда рады видеть вас снова. 🌙
    </p>

    <p style="font-size: 14px; color: ${colors.gray}; margin-top: 20px;">
      <em>Если у вас есть отзывы или предложения, как мы можем улучшить сервис,
      мы будем рады услышать их. Просто ответьте на это письмо.</em>
    </p>
  `;

  return {
    subject: 'Ваша Premium подписка отменена',
    html: emailWrapper(content)
  };
};

/**
 * Payment failed notification
 */
const paymentFailed = (user, invoice) => {
  const content = `
    <h2 style="color: ${colors.danger}; margin-top: 0;">
      ⚠️ Проблема с оплатой
    </h2>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Здравствуйте, <strong>${user.displayName}</strong>,
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      К сожалению, мы не смогли обработать ваш платёж для продления Premium подписки.
    </p>

    <div style="background-color: #fef2f2; border-left: 4px solid ${colors.danger}; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: ${colors.danger}; font-weight: 600;">
        ❌ Платёж отклонён
      </p>
      <p style="margin: 10px 0 0 0; color: ${colors.gray}; font-size: 14px;">
        Сумма: ${invoice.amount ? (invoice.amount / 100).toFixed(2) : 'N/A'} ${invoice.currency ? invoice.currency.toUpperCase() : 'USD'}
      </p>
    </div>

    <hr class="divider">

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      <strong>Возможные причины:</strong>
    </p>

    <ul style="color: ${colors.gray}; line-height: 1.8;">
      <li>Недостаточно средств на карте</li>
      <li>Карта истекла или заблокирована</li>
      <li>Банк отклонил транзакцию</li>
      <li>Превышен лимит карты</li>
    </ul>

    <hr class="divider">

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      <strong>Что делать:</strong>
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Пожалуйста, обновите платёжную информацию в настройках, чтобы продолжить пользоваться Premium функциями.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://ai-tarot-assistant.vercel.app/settings/billing" class="button">
        Обновить платёжные данные
      </a>
    </div>

    <hr class="divider">

    <p style="font-size: 14px; color: ${colors.gray}; background-color: ${colors.lightGray}; padding: 15px; border-radius: 8px;">
      ℹ️ <strong>Важно:</strong> Если проблема не будет решена, ваш доступ к Premium функциям может быть приостановлен.
      Вы автоматически вернётесь к базовому плану.
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray}; margin-top: 30px;">
      Если у вас возникли вопросы, мы всегда готовы помочь. Просто ответьте на это письмо.
    </p>
  `;

  return {
    subject: '⚠️ Не удалось обработать платёж для Premium подписки',
    html: emailWrapper(content)
  };
};

/**
 * Payment succeeded confirmation
 */
const paymentSucceeded = (user, invoice) => {
  const content = `
    <h2 style="color: ${colors.success}; margin-top: 0;">
      ✅ Платёж успешно проведён
    </h2>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Здравствуйте, <strong>${user.displayName}</strong>!
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Мы получили ваш платёж за Premium подписку. Спасибо за продолжение использования AI Tarot Decision Assistant!
    </p>

    <div style="background-color: #f0fdf4; border-left: 4px solid ${colors.success}; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: ${colors.success}; font-weight: 600;">
        ✅ Платёж получен
      </p>
      <p style="margin: 10px 0 0 0; color: ${colors.gray}; font-size: 14px;">
        Сумма: ${invoice.amount ? (invoice.amount / 100).toFixed(2) : 'N/A'} ${invoice.currency ? invoice.currency.toUpperCase() : 'USD'}<br>
        Дата: ${new Date().toLocaleDateString('ru-RU')}
      </p>
    </div>

    <hr class="divider">

    <p style="font-size: 16px; line-height: 1.6; color: ${colors.gray};">
      Ваша Premium подписка активна и продлена на следующий месяц. Наслаждайтесь всеми возможностями!
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://ai-tarot-assistant.vercel.app/reading/daily" class="button">
        Вытянуть карту дня 🔮
      </a>
    </div>

    <hr class="divider">

    <p style="font-size: 14px; color: ${colors.gray};">
      Квитанция прикреплена к этому письму. Вы также можете посмотреть все платежи в настройках аккаунта.
    </p>
  `;

  return {
    subject: '✅ Платёж за Premium подписку получен',
    html: emailWrapper(content)
  };
};

module.exports = {
  premiumWelcome,
  premiumCanceled,
  paymentFailed,
  paymentSucceeded
};
