/**
 * Spread Interpretation Service
 * Generates AI interpretations for spread positions
 */

const { getSpreadTemplate } = require('./spread-templates.service');
const path = require('path');
const fs = require('fs');

// Load cards data
const cardsPath = path.join(__dirname, '../db/data/cards.json');
let cardsData = [];

try {
  cardsData = JSON.parse(fs.readFileSync(cardsPath, 'utf-8'));
} catch (error) {
  console.error('Failed to load cards data:', error);
}

/**
 * Generate interpretation for a spread reading
 */
async function interpretSpread(spreadId, cards, question = null, context = {}) {
  const template = getSpreadTemplate(spreadId);

  if (!template) {
    throw new Error(`Spread template not found: ${spreadId}`);
  }

  // Validate card count
  if (cards.length !== template.cardCount) {
    throw new Error(`Expected ${template.cardCount} cards, got ${cards.length}`);
  }

  // Generate position interpretations
  const positionInterpretations = cards.map((card, index) => {
    const position = template.positions[index];

    return {
      position: position.id,
      positionName: position.name,
      positionMeaning: position.description,
      card: {
        name: card.name,
        image: card.image,
        suit: card.suit,
        number: card.number,
        reversed: card.reversed || false
      },
      interpretation: generatePositionInterpretation(card, position, question, context)
    };
  });

  // Generate overall summary
  const summary = generateSpreadSummary(spreadId, positionInterpretations, question);

  return {
    spreadId,
    spreadName: template.name,
    question,
    timestamp: new Date().toISOString(),
    positions: positionInterpretations,
    summary,
    advice: generateSpreadAdvice(positionInterpretations)
  };
}

/**
 * Generate interpretation for specific position
 */
function generatePositionInterpretation(card, position, question, _context) {
  const { name, reversed } = card;
  const positionContext = position.name;

  // Base interpretation
  let interpretation = `${name} в позиции "${positionContext}":\n\n`;

  // Card meaning in this position
  interpretation += `Эта карта показывает ${position.description.toLowerCase()}. `;

  // Add reversal context if needed
  if (reversed) {
    interpretation += `Карта перевёрнута, что указывает на блокировку энергии, внутренние процессы или необходимость пересмотреть подход. `;
  }

  // Context-specific interpretation
  if (question) {
    interpretation += `\n\nВ контексте вашего вопроса ("${question}") эта карта советует: `;
  }

  // Add card-specific meaning (placeholder - will be enhanced with AI)
  interpretation += getCardMeaningForPosition(card, position);

  return interpretation;
}

/**
 * Get card meaning for specific position
 */
function getCardMeaningForPosition(card, position) {
  // Find card data from database
  const cardData = cardsData.find(c => c.name === card.name || c._id === card.cardId);

  if (!cardData) {
    return `Обратитесь к значению карты "${card.name}" и примените его к "${position.name}".`;
  }

  // Get appropriate keywords
  const keywords = card.reversed
    ? cardData.keywords?.reversed || []
    : cardData.keywords?.upright || [];

  // Get decision interpretation if available
  let interpretation = '';

  if (cardData.interpretations?.decision) {
    const decisionTexts = card.reversed
      ? cardData.interpretations.decision.reversed
      : cardData.interpretations.decision.upright;

    if (decisionTexts && decisionTexts.length > 0) {
      // Pick random interpretation
      interpretation = decisionTexts[Math.floor(Math.random() * decisionTexts.length)];
    }
  }

  // Build meaning text
  let meaning = `Ключевые энергии: ${keywords.slice(0, 3).join(', ')}. `;

  if (interpretation) {
    meaning += interpretation;
  } else {
    meaning += `Используйте эти качества в контексте "${position.name}".`;
  }

  return meaning;
}

/**
 * Generate overall spread summary
 */
function generateSpreadSummary(spreadId, interpretations, _question) {
  const spreadNames = {
    'celtic-cross': 'Кельтский Крест',
    'relationship': 'Расклад Отношений',
    'past-present-future': 'Прошлое-Настоящее-Будущее',
    'simple-cross': 'Простой Крест',
    'career-path': 'Карьерный Путь',
    'year-ahead': 'Путь Года'
  };

  let summary = `Расклад "${spreadNames[spreadId] || spreadId}" показывает:\n\n`;

  // Analyze card patterns
  const _cardNames = interpretations.map(i => i.card.name);
  const reversedCount = interpretations.filter(i => i.card.reversed).length;

  if (reversedCount > interpretations.length / 2) {
    summary += `⚠️ Много перевёрнутых карт (${reversedCount}) указывает на внутренние процессы, блоки или необходимость работы над собой.\n\n`;
  }

  // Spread-specific summary
  if (spreadId === 'celtic-cross') {
    summary += `Ваша ситуация многогранна. Препятствия существуют, но есть ясный путь вперёд. Обратите особое внимание на карты "Итог" и "Совет".\n\n`;
  } else if (spreadId === 'relationship') {
    summary += `Отношения имеют как сильные стороны, так и вызовы. Работа над указанными областями принесёт гармонию.\n\n`;
  }

  summary += `Помните: Таро показывает вероятности, не предопределённость. Вы создаёте будущее своими выборами.`;

  return summary;
}

/**
 * Generate practical advice based on spread
 */
function generateSpreadAdvice(interpretations) {
  const advicePoints = [];

  interpretations.forEach((interp, _index) => {
    // Extract key advice from each position
    if (interp.positionName.includes('Совет') || interp.positionName.includes('Итог')) {
      advicePoints.push(`${interp.positionName}: Следуйте мудрости карты ${interp.card.name}`);
    }
  });

  if (advicePoints.length === 0) {
    advicePoints.push('Медитируйте над каждой картой и слушайте свою интуицию');
  }

  return advicePoints;
}

module.exports = {
  interpretSpread,
  generatePositionInterpretation,
  generateSpreadSummary
};
