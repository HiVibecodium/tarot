/**
 * Generate SVG placeholder images for all 78 tarot cards
 */

const fs = require('fs');
const path = require('path');

// Load cards data
const cardsPath = path.join(__dirname, '../src/backend/db/data/cards.json');
const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf-8'));

// Output directory
const outputDir = path.join(__dirname, '../src/frontend/public/cards');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Color schemes for suits
const colors = {
  major: { bg: '#764ba2', fg: '#ffffff', accent: '#ffd700' },
  wands: { bg: '#e74c3c', fg: '#ffffff', accent: '#f39c12' },
  cups: { bg: '#3498db', fg: '#ffffff', accent: '#5dade2' },
  swords: { bg: '#95a5a6', fg: '#ffffff', accent: '#bdc3c7' },
  pentacles: { bg: '#27ae60', fg: '#ffffff', accent: '#52be80' }
};

// Suit symbols
const suitSymbols = {
  wands: '🔥',
  cups: '💧',
  swords: '⚔️',
  pentacles: '⭕'
};

// Generate SVG for a card
function generateCardSVG(card) {
  const colorScheme = colors[card.suit || card.arcana] || colors.major;
  const symbol = card.suit ? suitSymbols[card.suit] : '⭐';

  // Wrap text to fit
  const name = card.name;
  const keywords = card.keywords?.upright?.slice(0, 3) || [];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="300" height="450" viewBox="0 0 300 450" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="bg-${card._id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colorScheme.bg}dd;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Card background -->
  <rect width="300" height="450" rx="15" fill="url(#bg-${card._id})"/>

  <!-- Border -->
  <rect x="10" y="10" width="280" height="430" rx="10" fill="none" stroke="${colorScheme.accent}" stroke-width="3"/>

  <!-- Top symbol -->
  <text x="30" y="50" font-size="40" fill="${colorScheme.fg}">${symbol}</text>

  <!-- Card number/type (top right) -->
  <text x="270" y="50" font-size="24" fill="${colorScheme.fg}" text-anchor="end">${card.number !== null && card.number !== undefined ? card.number : card.arcana === 'major' ? 'M' : ''}</text>

  <!-- Card name (center) -->
  <text x="150" y="200" font-size="28" font-weight="bold" fill="${colorScheme.fg}" text-anchor="middle">
    ${name.length > 15 ? name.substring(0, 14) + '...' : name}
  </text>

  <!-- Arcana type -->
  <text x="150" y="235" font-size="16" fill="${colorScheme.accent}" text-anchor="middle">
    ${card.arcana === 'major' ? 'Старший Аркан' : (card.suit || '').toUpperCase()}
  </text>

  <!-- Keywords -->
  ${keywords.map((kw, i) => `
  <rect x="30" y="${280 + i * 35}" width="240" height="28" rx="14" fill="${colorScheme.accent}" opacity="0.3"/>
  <text x="150" y="${300 + i * 35}" font-size="14" fill="${colorScheme.fg}" text-anchor="middle">${kw}</text>
  `).join('')}

  <!-- Bottom symbol -->
  <text x="270" y="430" font-size="40" fill="${colorScheme.fg}" text-anchor="end">${symbol}</text>

  <!-- Decorative corners -->
  <circle cx="30" cy="30" r="8" fill="${colorScheme.accent}" opacity="0.5"/>
  <circle cx="270" cy="30" r="8" fill="${colorScheme.accent}" opacity="0.5"/>
  <circle cx="30" cy="420" r="8" fill="${colorScheme.accent}" opacity="0.5"/>
  <circle cx="270" cy="420" r="8" fill="${colorScheme.accent}" opacity="0.5"/>
</svg>`;
}

// Generate all cards
console.log('🎴 Генерация placeholder изображений для Таро карт...\n');

let generated = 0;
cards.forEach(card => {
  const filename = card.imageUrl.split('/').pop();
  const filepath = path.join(outputDir, filename.replace('.jpg', '.svg'));

  const svg = generateCardSVG(card);
  fs.writeFileSync(filepath, svg);

  generated++;
  if (generated % 10 === 0) {
    console.log(`   Сгенерировано ${generated}/${cards.length}...`);
  }
});

console.log(`\n✅ Готово! Создано ${generated} SVG файлов в ${outputDir}`);
console.log('\n💡 Для использования JPG вместо SVG:');
console.log('   - Установите sharp: npm install sharp');
console.log('   - Запустите конвертацию: node scripts/convert-svg-to-jpg.js');
