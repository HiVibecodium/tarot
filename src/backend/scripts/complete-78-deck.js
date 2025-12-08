/**
 * Complete 78-Card Tarot Deck
 * Remaining 44 Minor Arcana cards
 */

// Remaining WANDS (4-14 + Court cards)
const remainingWands = [
  // Number cards 4-10
  { _id: 'wands-04', name: 'Четвёрка Жезлов', number: 4, keywords: { upright: ['праздник', 'гармония', 'дом', 'стабильность'], reversed: ['нестабильность', 'переезд', 'разлад'] }},
  { _id: 'wands-05', name: 'Пятёрка Жезлов', number: 5, keywords: { upright: ['конфликт', 'соревнование', 'напряжение'], reversed: ['избегание конфликта', 'компромисс'] }},
  { _id: 'wands-06', name: 'Шестёрка Жезлов', number: 6, keywords: { upright: ['победа', 'признание', 'успех'], reversed: ['поражение', 'задержка признания'] }},
  { _id: 'wands-07', name: 'Семёрка Жезлов', number: 7, keywords: { upright: ['защита', 'вызов', 'настойчивость'], reversed: ['сдача', 'истощение'] }},
  { _id: 'wands-08', name: 'Восьмёрка Жезлов', number: 8, keywords: { upright: ['скорость', 'движение', 'прогресс'], reversed: ['задержки', 'застой'] }},
  { _id: 'wands-09', name: 'Девятка Жезлов', number: 9, keywords: { upright: ['стойкость', 'защита границ'], reversed: ['усталость', 'паранойя'] }},
  { _id: 'wands-10', name: 'Десятка Жезлов', number: 10, keywords: { upright: ['бремя', 'ответственность'], reversed: ['освобождение от бремени'] }},
  // Court cards
  { _id: 'wands-page', name: 'Паж Жезлов', number: 11, keywords: { upright: ['новости', 'энтузиазм', 'исследование'], reversed: ['плохие новости', 'нетерпение'] }},
  { _id: 'wands-knight', name: 'Рыцарь Жезлов', number: 12, keywords: { upright: ['действие', 'страсть', 'импульсивность'], reversed: ['безрассудство', 'промедление'] }},
  { _id: 'wands-queen', name: 'Королева Жезлов', number: 13, keywords: { upright: ['уверенность', 'харизма', 'независимость'], reversed: ['эгоизм', 'ревность'] }},
  { _id: 'wands-king', name: 'Король Жезлов', number: 14, keywords: { upright: ['лидерство', 'видение', 'предприниматель'], reversed: ['тирания', 'высокомерие'] }}
];

// Remaining CUPS (4-14 + Court cards)
const remainingCups = [
  { _id: 'cups-04', name: 'Четвёрка Кубков', number: 4, keywords: { upright: ['апатия', 'созерцание', 'переоценка'], reversed: ['новые возможности', 'мотивация'] }},
  { _id: 'cups-05', name: 'Пятёрка Кубков', number: 5, keywords: { upright: ['потеря', 'сожаление', 'разочарование'], reversed: ['принятие', 'двигаться дальше'] }},
  { _id: 'cups-06', name: 'Шестёрка Кубков', number: 6, keywords: { upright: ['ностальгия', 'воспоминания', 'детство'], reversed: ['застревание в прошлом'] }},
  { _id: 'cups-07', name: 'Семёрка Кубков', number: 7, keywords: { upright: ['выбор', 'иллюзия', 'фантазия'], reversed: ['ясность', 'решительность'] }},
  { _id: 'cups-08', name: 'Восьмёрка Кубков', number: 8, keywords: { upright: ['уход', 'отпускание', 'разочарование'], reversed: ['возвращение', 'принятие'] }},
  { _id: 'cups-09', name: 'Девятка Кубков', number: 9, keywords: { upright: ['желания сбываются', 'удовлетворение'], reversed: ['неудовлетворённость', 'жадность'] }},
  { _id: 'cups-10', name: 'Десятка Кубков', number: 10, keywords: { upright: ['счастье', 'гармония', 'семья'], reversed: ['разлад в семье', 'разрыв'] }},
  { _id: 'cups-page', name: 'Паж Кубков', number: 11, keywords: { upright: ['творчество', 'интуиция', 'новая любовь'], reversed: ['эмоциональная незрелость'] }},
  { _id: 'cups-knight', name: 'Рыцарь Кубков', number: 12, keywords: { upright: ['романтика', 'шарм', 'воображение'], reversed: ['муди, нереалистичность'] }},
  { _id: 'cups-queen', name: 'Королева Кубков', number: 13, keywords: { upright: ['сострадание', 'интуиция', 'эмпатия'], reversed: ['эмоциональная зависимость'] }},
  { _id: 'cups-king', name: 'Король Кубков', number: 14, keywords: { upright: ['эмоциональный баланс', 'дипломатия'], reversed: ['манипуляция чувствами'] }}
];

// Remaining SWORDS (4-14 + Court cards)
const remainingSwords = [
  { _id: 'swords-04', name: 'Четвёрка Мечей', number: 4, keywords: { upright: ['отдых', 'восстановление', 'медитация'], reversed: ['истощение', 'бессонница'] }},
  { _id: 'swords-05', name: 'Пятёрка Мечей', number: 5, keywords: { upright: ['конфликт', 'поражение', 'предательство'], reversed: ['примирение', 'прощение'] }},
  { _id: 'swords-06', name: 'Шестёрка Мечей', number: 6, keywords: { upright: ['переход', 'путешествие', 'движение вперёд'], reversed: ['застревание', 'сопротивление'] }},
  { _id: 'swords-07', name: 'Семёрка Мечей', number: 7, keywords: { upright: ['обман', 'стратегия', 'хитрость'], reversed: ['раскаяние', 'честность'] }},
  { _id: 'swords-08', name: 'Восьмёрка Мечей', number: 8, keywords: { upright: ['ограничение', 'беспомощность'], reversed: ['освобождение', 'новые возможности'] }},
  { _id: 'swords-09', name: 'Девятка Мечей', number: 9, keywords: { upright: ['тревога', 'кошмары', 'вина'], reversed: ['исцеление', 'надежда'] }},
  { _id: 'swords-10', name: 'Десятка Мечей', number: 10, keywords: { upright: ['конец', 'крах', 'болезненное завершение'], reversed: ['восстановление', 'выздоровление'] }},
  { _id: 'swords-page', name: 'Паж Мечей', number: 11, keywords: { upright: ['любопытство', 'бдительность', 'идеи'], reversed: ['сплетни', 'шпионаж'] }},
  { _id: 'swords-knight', name: 'Рыцарь Мечей', number: 12, keywords: { upright: ['действие', 'амбиции', 'импульсивность'], reversed: ['безрассудство'] }},
  { _id: 'swords-queen', name: 'Королева Мечей', number: 13, keywords: { upright: ['независимость', 'ясность ума'], reversed: ['холодность', 'жестокость'] }},
  { _id: 'swords-king', name: 'Король Мечей', number: 14, keywords: { upright: ['интеллект', 'правда', 'авторитет'], reversed: ['манипуляция', 'жестокость'] }}
];

// Remaining PENTACLES (4-14 + Court cards)
const remainingPentacles = [
  { _id: 'pentacles-04', name: 'Четвёрка Пентаклей', number: 4, keywords: { upright: ['безопасность', 'контроль', 'жадность'], reversed: ['щедрость', 'делиться'] }},
  { _id: 'pentacles-05', name: 'Пятёрка Пентаклей', number: 5, keywords: { upright: ['бедность', 'потеря', 'изоляция'], reversed: ['восстановление', 'помощь'] }},
  { _id: 'pentacles-06', name: 'Шестёрка Пентаклей', number: 6, keywords: { upright: ['щедрость', 'благотворительность', 'справедливость'], reversed: ['долги', 'жадность'] }},
  { _id: 'pentacles-07', name: 'Семёрка Пентаклей', number: 7, keywords: { upright: ['терпение', 'долгосрочные цели'], reversed: ['нетерпение', 'малые результаты'] }},
  { _id: 'pentacles-08', name: 'Восьмёрка Пентаклей', number: 8, keywords: { upright: ['мастерство', 'обучение', 'труд'], reversed: ['перфекционизм', 'отсутствие фокуса'] }},
  { _id: 'pentacles-09', name: 'Девятка Пентаклей', number: 9, keywords: { upright: ['изобилие', 'роскошь', 'независимость'], reversed: ['материализм', 'переработка'] }},
  { _id: 'pentacles-10', name: 'Десятка Пентаклей', number: 10, keywords: { upright: ['богатство', 'семья', 'наследство'], reversed: ['финансовые потери', 'разлад'] }},
  { _id: 'pentacles-page', name: 'Паж Пентаклей', number: 11, keywords: { upright: ['возможности', 'обучение', 'проявление'], reversed: ['промедление', 'нереализованный потенциал'] }},
  { _id: 'pentacles-knight', name: 'Рыцарь Пентаклей', number: 12, keywords: { upright: ['трудолюбие', 'ответственность'], reversed: ['лень', 'перфекционизм'] }},
  { _id: 'pentacles-queen', name: 'Королева Пентаклей', number: 13, keywords: { upright: ['практичность', 'забота', 'процветание'], reversed: ['зависимость', 'жадность'] }},
  { _id: 'pentacles-king', name: 'Король Пентаклей', number: 14, keywords: { upright: ['богатство', 'бизнес', 'лидерство'], reversed: ['жадность', 'материализм'] }}
];

// Helper function to create full interpretation structure
function createInterpretations(keywords, _suit) {
  const uprightKeys = keywords.upright;
  const reversedKeys = keywords.reversed;

  return {
    daily: {
      upright: [
        `Сегодня энергия ${uprightKeys[0]} поддержит вас`,
        `День благоприятен для ${uprightKeys[1] || uprightKeys[0]}`,
        `${uprightKeys[2] || uprightKeys[0]} - ключевая тема дня`
      ],
      reversed: [
        `Будьте осторожны с ${reversedKeys[0]}`,
        `${reversedKeys[1] || reversedKeys[0]} может проявиться сегодня`,
        `Избегайте ${reversedKeys[0]} в делах`
      ]
    },
    decision: {
      upright: [
        `Решение связано с ${uprightKeys[0]}`,
        `${uprightKeys[1] || uprightKeys[0]} поможет в выборе`,
        `Действуйте через ${uprightKeys[2] || uprightKeys[0]}`
      ],
      reversed: [
        `Остерегайтесь ${reversedKeys[0]} в решении`,
        `${reversedKeys[1] || reversedKeys[0]} может помешать`,
        `Избегайте ${reversedKeys[0]}`
      ]
    },
    purchase: {
      upright: [
        `Покупка принесёт ${uprightKeys[0]}`,
        `${uprightKeys[1] || uprightKeys[0]} от этого товара`,
        `Хороший выбор для ${uprightKeys[0]}`
      ],
      reversed: [
        `Покупка может привести к ${reversedKeys[0]}`,
        `${reversedKeys[1] || reversedKeys[0]} от траты`,
        `Не покупайте из-за ${reversedKeys[0]}`
      ]
    }
  };
}

// Add full interpretations and metadata
const completeRemainingWands = remainingWands.map(card => ({
  ...card,
  arcana: 'minor',
  suit: 'wands',
  interpretations: createInterpretations(card.keywords, 'wands'),
  imageUrl: `/cards/${card._id}.jpg`
}));

const completeRemainingCups = remainingCups.map(card => ({
  ...card,
  arcana: 'minor',
  suit: 'cups',
  interpretations: createInterpretations(card.keywords, 'cups'),
  imageUrl: `/cards/${card._id}.jpg`
}));

const completeRemainingSwords = remainingSwords.map(card => ({
  ...card,
  arcana: 'minor',
  suit: 'swords',
  interpretations: createInterpretations(card.keywords, 'swords'),
  imageUrl: `/cards/${card._id}.jpg`
}));

const completeRemainingPentacles = remainingPentacles.map(card => ({
  ...card,
  arcana: 'minor',
  suit: 'pentacles',
  interpretations: createInterpretations(card.keywords, 'pentacles'),
  imageUrl: `/cards/${card._id}.jpg`
}));

module.exports = {
  completeRemainingWands,
  completeRemainingCups,
  completeRemainingSwords,
  completeRemainingPentacles
};
