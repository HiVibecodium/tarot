/**
 * Generate Placeholder Card Images
 * Creates colored placeholder images for all 78 Tarot cards
 * Use this temporarily until real Rider-Waite images are downloaded
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Import card mapping
const { CARD_MAPPING } = require('./setup-card-images');

// Color schemes for each suit
const COLORS = {
  major: { bg: '#667eea', text: '#ffffff' },
  wands: { bg: '#f093fb', text: '#ffffff' },
  cups: { bg: '#4facfe', text: '#ffffff' },
  swords: { bg: '#43e97b', text: '#ffffff' },
  pentacles: { bg: '#fa709a', text: '#ffffff' }
};

// Image dimensions
const WIDTH = 400;
const HEIGHT = 700;

/**
 * Create SVG placeholder
 */
function createSVG(text, color) {
  return `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(color.bg, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grad)" rx="10"/>

      <!-- Border -->
      <rect x="10" y="10" width="${WIDTH-20}" height="${HEIGHT-20}"
            fill="none" stroke="${color.text}" stroke-width="3" rx="5"/>

      <!-- Card icon -->
      <text x="${WIDTH/2}" y="100"
            font-family="Arial, sans-serif"
            font-size="80"
            fill="${color.text}"
            text-anchor="middle">
        ${getSuitIcon(text)}
      </text>

      <!-- Card name -->
      <text x="${WIDTH/2}" y="${HEIGHT/2}"
            font-family="Arial, sans-serif"
            font-size="24"
            font-weight="bold"
            fill="${color.text}"
            text-anchor="middle"
            style="word-spacing: 100vw;">
        ${wrapText(text, 16)}
      </text>

      <!-- Decorative elements -->
      <circle cx="${WIDTH/2}" cy="600" r="40" fill="none" stroke="${color.text}" stroke-width="2"/>
      <circle cx="${WIDTH/2}" cy="600" r="30" fill="none" stroke="${color.text}" stroke-width="1"/>
    </svg>
  `;
}

/**
 * Get emoji icon for suit
 */
function getSuitIcon(cardName) {
  if (cardName.includes('Wand')) return '🔥';
  if (cardName.includes('Cup')) return '💧';
  if (cardName.includes('Sword')) return '⚔️';
  if (cardName.includes('Pentacle')) return '⭐';
  return '🔮'; // Major Arcana
}

/**
 * Wrap text to multiple lines
 */
function wrapText(text, maxLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);

  return lines.map((line, i) =>
    `<tspan x="${WIDTH/2}" dy="${i === 0 ? 0 : 30}">${line}</tspan>`
  ).join('');
}

/**
 * Adjust color brightness
 */
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

/**
 * Generate all placeholder images
 */
async function generateAllPlaceholders() {
  console.log('🎨 Generating placeholder images for 78 Tarot cards...\n');

  let generated = 0;
  const errors = [];

  for (const [suit, cards] of Object.entries(CARD_MAPPING)) {
    const color = COLORS[suit];
    const outputDir = path.join(__dirname, '../src/frontend/public/images/cards', suit);

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const card of cards) {
      try {
        const svg = createSVG(card.display, color);
        const outputPath = path.join(outputDir, `${card.id}.webp`);

        // Convert SVG to WebP using sharp
        await sharp(Buffer.from(svg))
          .webp({ quality: 85 })
          .toFile(outputPath);

        generated++;
        process.stdout.write(`\r✓ Generated: ${generated}/78`);
      } catch (error) {
        errors.push(`${suit}/${card.id}: ${error.message}`);
      }
    }
  }

  console.log('\n');

  if (errors.length > 0) {
    console.log('⚠️  Errors:', errors.length);
    errors.forEach(e => console.log(`   - ${e}`));
  } else {
    console.log('✅ All 78 placeholder images generated successfully!');
  }

  // Also create a placeholder for fallback
  try {
    const fallbackSVG = createSVG('Card Not Found', COLORS.major);
    const fallbackPath = path.join(__dirname, '../src/frontend/public/images/cards/placeholder.webp');

    await sharp(Buffer.from(fallbackSVG))
      .webp({ quality: 85 })
      .toFile(fallbackPath);

    console.log('✅ Fallback placeholder created');
  } catch (error) {
    console.log('⚠️  Error creating fallback:', error.message);
  }

  console.log('\n📊 Summary:');
  console.log(`   Total: 78 cards`);
  console.log(`   Generated: ${generated}`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Format: WebP (optimized)`);
  console.log(`   Size: ${WIDTH}x${HEIGHT}px`);

  console.log('\n💡 Note: These are temporary placeholders.');
  console.log('   Replace with real Rider-Waite images when available.');
}

// Run generator
generateAllPlaceholders().catch(console.error);
