/**
 * SEO Component
 * Manages meta tags, Open Graph, and Twitter cards
 */

import { Helmet } from 'react-helmet-async';

function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'AI Tarot Decision Assistant'
}) {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://tarot-assistant.com';
  const siteName = 'AI Tarot Decision Assistant';

  // Default values
  const defaultTitle = 'AI Tarot Decision Assistant - Расклады Таро для Принятия Решений';
  const defaultDescription = 'Помощник для принятия решений через Таро. Ежедневные расклады, анализ решений, премиум функции. Русский интерфейс.';
  const defaultImage = `${siteUrl}/og-image.jpg`;
  const defaultKeywords = 'таро, расклады таро, гадание, принятие решений, таро онлайн, карты таро, русское таро';

  // Build full title
  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;

  // Use provided or default values
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || defaultImage;
  const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />

      {/* Canonical URL */}
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* VK (VKontakte) */}
      <meta property="vk:image" content={metaImage} />

      {/* Additional Meta */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Russian" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />

      {/* Favicon & App */}
      <meta name="theme-color" content="#667eea" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Таро Помощник" />
    </Helmet>
  );
}

/**
 * SEO for specific page types
 */

export function HomeSEO() {
  return (
    <SEO
      title="Главная"
      description="AI Tarot Decision Assistant - помощник для принятия решений через расклады Таро. Ежедневные расклады, анализ решений, премиум функции."
      keywords="таро онлайн, гадание таро, расклад дня, таро решения, таро помощник"
    />
  );
}

export function DailyReadingSEO() {
  return (
    <SEO
      title="Расклад Дня"
      description="Получите ежедневную карту Таро с персонализированной интерпретацией. Один бесплатный расклад каждый день."
      keywords="расклад дня, ежедневное таро, карта дня, таро прогноз"
    />
  );
}

export function DecisionSEO() {
  return (
    <SEO
      title="Анализ Решения"
      description="Расклад на 3 карты для анализа сложных решений. Прошлое, Настоящее, Будущее - получите guidance для важных выборов."
      keywords="таро решения, анализ решений, расклад на решение, таро выбор, помощь в решении"
    />
  );
}

export function CardsSEO() {
  return (
    <SEO
      title="Энциклопедия Карт"
      description="Полная энциклопедия 78 карт Таро с интерпретациями. Изучите значения Major и Minor Arcana."
      keywords="карты таро, значение карт таро, таро энциклопедия, старшие арканы, младшие арканы"
    />
  );
}

export function PremiumSEO() {
  return (
    <SEO
      title="Premium Подписка"
      description="Получите неограниченные расклады, все 78 карт, расширенную аналитику и эксклюзивные интерпретации за ₽499/месяц."
      keywords="таро премиум, подписка таро, unlimited таро, premium функции"
    />
  );
}

export function AnalyticsSEO() {
  return (
    <SEO
      title="Аналитика и Статистика"
      description="Визуализация ваших раскладов Таро. Частота карт, паттерны, trends и insights на основе истории раскладов."
      keywords="таро статистика, аналитика таро, паттерны карт, таро insights"
    />
  );
}

export function HistorySEO() {
  return (
    <SEO
      title="История Раскладов"
      description="Просмотрите всю историю ваших раскладов Таро. Отслеживайте серии, экспортируйте в PDF, анализируйте результаты."
      keywords="история таро, архив раскладов, таро дневник, экспорт pdf"
    />
  );
}

export function ProfileSEO() {
  return (
    <SEO
      title="Профиль"
      description="Ваш профиль в AI Tarot Assistant. Статистика, настройки, GDPR экспорт данных, управление подпиской."
      keywords="профиль таро, настройки, статистика пользователя"
    />
  );
}

export default SEO;
