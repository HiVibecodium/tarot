/**
 * Card Images Setup Script
 * Downloads and organizes Rider-Waite Tarot card images
 */

const fs = require('fs');
const path = require('path');

// Card mapping for filenames
const CARD_MAPPING = {
  // Major Arcana
  major: [
    { id: '00', name: 'fool', display: 'The Fool' },
    { id: '01', name: 'magician', display: 'The Magician' },
    { id: '02', name: 'high-priestess', display: 'The High Priestess' },
    { id: '03', name: 'empress', display: 'The Empress' },
    { id: '04', name: 'emperor', display: 'The Emperor' },
    { id: '05', name: 'hierophant', display: 'The Hierophant' },
    { id: '06', name: 'lovers', display: 'The Lovers' },
    { id: '07', name: 'chariot', display: 'The Chariot' },
    { id: '08', name: 'strength', display: 'Strength' },
    { id: '09', name: 'hermit', display: 'The Hermit' },
    { id: '10', name: 'wheel-of-fortune', display: 'Wheel of Fortune' },
    { id: '11', name: 'justice', display: 'Justice' },
    { id: '12', name: 'hanged-man', display: 'The Hanged Man' },
    { id: '13', name: 'death', display: 'Death' },
    { id: '14', name: 'temperance', display: 'Temperance' },
    { id: '15', name: 'devil', display: 'The Devil' },
    { id: '16', name: 'tower', display: 'The Tower' },
    { id: '17', name: 'star', display: 'The Star' },
    { id: '18', name: 'moon', display: 'The Moon' },
    { id: '19', name: 'sun', display: 'The Sun' },
    { id: '20', name: 'judgement', display: 'Judgement' },
    { id: '21', name: 'world', display: 'The World' }
  ],

  // Minor Arcana - Wands
  wands: [
    { id: 'ace', name: 'ace', display: 'Ace of Wands' },
    { id: '02', name: '02', display: 'Two of Wands' },
    { id: '03', name: '03', display: 'Three of Wands' },
    { id: '04', name: '04', display: 'Four of Wands' },
    { id: '05', name: '05', display: 'Five of Wands' },
    { id: '06', name: '06', display: 'Six of Wands' },
    { id: '07', name: '07', display: 'Seven of Wands' },
    { id: '08', name: '08', display: 'Eight of Wands' },
    { id: '09', name: '09', display: 'Nine of Wands' },
    { id: '10', name: '10', display: 'Ten of Wands' },
    { id: 'page', name: 'page', display: 'Page of Wands' },
    { id: 'knight', name: 'knight', display: 'Knight of Wands' },
    { id: 'queen', name: 'queen', display: 'Queen of Wands' },
    { id: 'king', name: 'king', display: 'King of Wands' }
  ],

  // Minor Arcana - Cups
  cups: [
    { id: 'ace', name: 'ace', display: 'Ace of Cups' },
    { id: '02', name: '02', display: 'Two of Cups' },
    { id: '03', name: '03', display: 'Three of Cups' },
    { id: '04', name: '04', display: 'Four of Cups' },
    { id: '05', name: '05', display: 'Five of Cups' },
    { id: '06', name: '06', display: 'Six of Cups' },
    { id: '07', name: '07', display: 'Seven of Cups' },
    { id: '08', name: '08', display: 'Eight of Cups' },
    { id: '09', name: '09', display: 'Nine of Cups' },
    { id: '10', name: '10', display: 'Ten of Cups' },
    { id: 'page', name: 'page', display: 'Page of Cups' },
    { id: 'knight', name: 'knight', display: 'Knight of Cups' },
    { id: 'queen', name: 'queen', display: 'Queen of Cups' },
    { id: 'king', name: 'king', display: 'King of Cups' }
  ],

  // Minor Arcana - Swords
  swords: [
    { id: 'ace', name: 'ace', display: 'Ace of Swords' },
    { id: '02', name: '02', display: 'Two of Swords' },
    { id: '03', name: '03', display: 'Three of Swords' },
    { id: '04', name: '04', display: 'Four of Swords' },
    { id: '05', name: '05', display: 'Five of Swords' },
    { id: '06', name: '06', display: 'Six of Swords' },
    { id: '07', name: '07', display: 'Seven of Swords' },
    { id: '08', name: '08', display: 'Eight of Swords' },
    { id: '09', name: '09', display: 'Nine of Swords' },
    { id: '10', name: '10', display: 'Ten of Swords' },
    { id: 'page', name: 'page', display: 'Page of Swords' },
    { id: 'knight', name: 'knight', display: 'Knight of Swords' },
    { id: 'queen', name: 'queen', display: 'Queen of Swords' },
    { id: 'king', name: 'king', display: 'King of Swords' }
  ],

  // Minor Arcana - Pentacles
  pentacles: [
    { id: 'ace', name: 'ace', display: 'Ace of Pentacles' },
    { id: '02', name: '02', display: 'Two of Pentacles' },
    { id: '03', name: '03', display: 'Three of Pentacles' },
    { id: '04', name: '04', display: 'Four of Pentacles' },
    { id: '05', name: '05', display: 'Five of Pentacles' },
    { id: '06', name: '06', display: 'Six of Pentacles' },
    { id: '07', name: '07', display: 'Seven of Pentacles' },
    { id: '08', name: '08', display: 'Eight of Pentacles' },
    { id: '09', name: '09', display: 'Nine of Pentacles' },
    { id: '10', name: '10', display: 'Ten of Pentacles' },
    { id: 'page', name: 'page', display: 'Page of Pentacles' },
    { id: 'knight', name: 'knight', display: 'Knight of Pentacles' },
    { id: 'queen', name: 'queen', display: 'Queen of Pentacles' },
    { id: 'king', name: 'king', display: 'King of Pentacles' }
  ]
};

/**
 * Generate README with instructions for downloading images
 */
function generateInstructions() {
  const instructions = `# Rider-Waite Tarot Card Images Setup

## Sources for Public Domain Images

### Option 1: Wikipedia Commons (Recommended)
1. Visit: https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck
2. Download all 78 cards
3. Rename according to the mapping below

### Option 2: Sacred Texts
1. Visit: https://www.sacred-texts.com/tarot/pkt/
2. Download card images (public domain)

### Option 3: Tarot.com Free Resources
1. Check their free Rider-Waite deck resources

## File Naming Convention

Place images in the following structure:

\`\`\`
src/frontend/public/images/cards/
├── major/
│   ├── 00-fool.jpg
│   ├── 01-magician.jpg
│   └── ... (22 cards)
├── wands/
│   ├── ace.jpg
│   ├── 02.jpg
│   └── ... (14 cards)
├── cups/ (14 cards)
├── swords/ (14 cards)
└── pentacles/ (14 cards)
\`\`\`

## Card Mapping

${Object.entries(CARD_MAPPING).map(([suit, cards]) => {
  return `### ${suit.toUpperCase()}\n${cards.map(c => `- ${c.id}.jpg → ${c.display}`).join('\n')}`;
}).join('\n\n')}

## After Downloading

1. Place all images in correct folders
2. Run optimization script:
   \`\`\`bash
   node scripts/optimize-card-images.js
   \`\`\`

3. Images will be optimized to WebP format

## Alternative: Use Placeholder Generator

If you can't find images immediately, you can generate colored placeholders:
\`\`\`bash
node scripts/generate-placeholder-images.js
\`\`\`

This will create colored placeholder images for testing.
`;

  const readmePath = path.join(__dirname, '../CARD-IMAGES-README.md');
  fs.writeFileSync(readmePath, instructions);
  console.log('✅ Instructions created: CARD-IMAGES-README.md');
}

/**
 * Generate mapping JSON for frontend
 */
function generateMapping() {
  const mappingPath = path.join(__dirname, '../src/frontend/src/utils/cardImageMapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(CARD_MAPPING, null, 2));
  console.log('✅ Card mapping created: src/frontend/src/utils/cardImageMapping.json');
}

/**
 * Check which images are missing
 */
function checkMissingImages() {
  const baseDir = path.join(__dirname, '../src/frontend/public/images/cards');
  const missing = [];

  Object.entries(CARD_MAPPING).forEach(([suit, cards]) => {
    cards.forEach(card => {
      const imagePath = path.join(baseDir, suit, `${card.id}.jpg`);
      const imagePathPng = path.join(baseDir, suit, `${card.id}.png`);
      const imagePathWebp = path.join(baseDir, suit, `${card.id}.webp`);

      if (!fs.existsSync(imagePath) && !fs.existsSync(imagePathPng) && !fs.existsSync(imagePathWebp)) {
        missing.push(`${suit}/${card.id} (${card.display})`);
      }
    });
  });

  if (missing.length > 0) {
    console.log(`⚠️  Missing ${missing.length} images:`);
    missing.forEach(m => console.log(`   - ${m}`));
  } else {
    console.log('✅ All 78 card images found!');
  }

  return missing;
}

// Main execution
console.log('🎴 Rider-Waite Card Images Setup\n');

generateInstructions();
generateMapping();

console.log('\n📋 Checking for existing images...');
const missing = checkMissingImages();

if (missing.length > 0) {
  console.log('\n📥 Next steps:');
  console.log('1. Read CARD-IMAGES-README.md for download instructions');
  console.log('2. Download images from Wikipedia Commons or Sacred Texts');
  console.log('3. Place them in src/frontend/public/images/cards/');
  console.log('4. Run: node scripts/optimize-card-images.js');
  console.log('\nOr generate placeholders with:');
  console.log('   node scripts/generate-placeholder-images.js');
}

module.exports = { CARD_MAPPING, checkMissingImages };
