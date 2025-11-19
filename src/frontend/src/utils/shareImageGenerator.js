/**
 * Share Image Generator
 * Создаёт красивые картинки раскладов для sharing в соцсетях
 */

export async function generateReadingImage(reading) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Размер для соцсетей (оптимальный для превью)
  canvas.width = 1200;
  canvas.height = 630;

  // Градиентный фон
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Полупрозрачный overlay для контраста
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Заголовок
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔮 Мой Расклад Таро', canvas.width / 2, 80);

  // Тип расклада
  ctx.font = '32px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const typeText = getReadingTypeText(reading.readingType);
  ctx.fillText(typeText, canvas.width / 2, 130);

  // Вопрос (если есть)
  if (reading.question) {
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const maxWidth = canvas.width - 100;
    wrapText(ctx, `"${reading.question}"`, canvas.width / 2, 180, maxWidth, 35);
  }

  // Карты
  const cardsY = reading.question ? 280 : 200;
  const cardCount = Math.min(reading.cards.length, 5); // Показываем макс 5 карт
  const cardWidth = 150;
  const cardHeight = 250;
  const spacing = 20;
  const totalWidth = (cardWidth * cardCount) + (spacing * (cardCount - 1));
  let startX = (canvas.width - totalWidth) / 2;

  for (let i = 0; i < cardCount; i++) {
    const card = reading.cards[i];
    const x = startX + (i * (cardWidth + spacing));

    // Карточка
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;

    roundRect(ctx, x, cardsY, cardWidth, cardHeight, 10);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Название карты
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.textAlign = 'center';
    const cardName = card.name || card.cardName;
    wrapText(ctx, cardName, x + cardWidth / 2, cardsY + 20, cardWidth - 20, 22);

    // Позиция (если есть)
    if (card.positionName) {
      ctx.font = '14px Arial, sans-serif';
      ctx.fillStyle = '#666';
      ctx.fillText(card.positionName, x + cardWidth / 2, cardsY + cardHeight - 15);
    }
  }

  // Watermark внизу
  ctx.textAlign = 'center';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.fillStyle = 'white';
  ctx.fillText('Таро Помощник Решений', canvas.width / 2, canvas.height - 60);

  ctx.font = '16px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('tarot-assistant.com', canvas.width / 2, canvas.height - 30);

  // Конвертируем canvas в blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', 0.95);
  });
}

/**
 * Вспомогательная функция: рисует скруглённый прямоугольник
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Вспомогательная функция: переносит текст на новую строку
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lineY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, lineY);
      line = words[i] + ' ';
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, lineY);
}

/**
 * Получает красивое название типа расклада
 */
function getReadingTypeText(type) {
  const types = {
    'daily': 'Карта Дня',
    'decision': 'Расклад на Решение',
    'celtic-cross': 'Кельтский Крест',
    'relationship': 'Расклад Отношений',
    'career-path': 'Карьерный Путь',
    'year-ahead': 'Путь Года',
    'past-present-future': 'Прошлое-Настоящее-Будущее'
  };
  return types[type] || 'Расклад Таро';
}

/**
 * Скачивает изображение
 */
export async function downloadReadingImage(reading) {
  const blob = await generateReadingImage(reading);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tarot-reading-${Date.now()}.png`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Делится изображением (если поддерживается)
 */
export async function shareReadingImage(reading) {
  const blob = await generateReadingImage(reading);
  const file = new File([blob], 'tarot-reading.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'Мой расклад Таро',
        text: getShareText(reading),
        files: [file]
      });
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  } else {
    // Fallback: скачать изображение
    await downloadReadingImage(reading);
    return true;
  }
}

function getShareText(reading) {
  if (!reading) return '';

  let text = '🔮 Мой расклад Таро\n\n';

  if (reading.question) {
    text += `Вопрос: ${reading.question}\n\n`;
  }

  text += 'Попробуй сам: tarot-assistant.com';
  return text;
}
