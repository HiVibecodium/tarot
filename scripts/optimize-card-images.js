/**
 * Optimize Card Images
 * Converts and optimizes real Rider-Waite images to WebP format
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const { CARD_MAPPING } = require('./setup-card-images');

// Target dimensions
const TARGET_WIDTH = 400;
const TARGET_HEIGHT = 700;

/**
 * Optimize single image
 */
async function optimizeImage(inputPath, outputPath) {
  await sharp(inputPath)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: 'cover',
      position: 'center'
    })
    .webp({ quality: 85 })
    .toFile(outputPath);
}

/**
 * Find image file (supports jpg, png, jpeg)
 */
function findImageFile(baseDir, suit, cardId) {
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];

  for (const ext of extensions) {
    const imagePath = path.join(baseDir, suit, `${cardId}.${ext}`);
    if (fs.existsSync(imagePath)) {
      return imagePath;
    }
  }

  return null;
}

/**
 * Optimize all card images
 */
async function optimizeAllImages() {
  console.log('🔧 Optimizing Tarot card images...\n');

  const baseDir = path.join(__dirname, '../src/frontend/public/images/cards');
  let optimized = 0;
  let skipped = 0;
  const errors = [];

  for (const [suit, cards] of Object.entries(CARD_MAPPING)) {
    for (const card of cards) {
      const inputPath = findImageFile(baseDir, suit, card.id);

      if (!inputPath) {
        skipped++;
        continue;
      }

      // Skip if already WebP and correct size
      if (inputPath.endsWith('.webp')) {
        try {
          const metadata = await sharp(inputPath).metadata();
          if (metadata.width === TARGET_WIDTH && metadata.height === TARGET_HEIGHT) {
            optimized++;
            process.stdout.write(`\r✓ Optimized: ${optimized}/78 (${skipped} skipped)`);
            continue;
          }
        } catch (error) {
          // Continue to re-optimize if metadata check fails
        }
      }

      try {
        const outputPath = path.join(baseDir, suit, `${card.id}.webp`);

        await optimizeImage(inputPath, outputPath);

        // Remove original if it's not webp
        if (!inputPath.endsWith('.webp')) {
          fs.unlinkSync(inputPath);
        }

        optimized++;
        process.stdout.write(`\r✓ Optimized: ${optimized}/78 (${skipped} skipped)`);
      } catch (error) {
        errors.push(`${suit}/${card.id}: ${error.message}`);
      }
    }
  }

  console.log('\n');

  if (errors.length > 0) {
    console.log('⚠️  Errors:', errors.length);
    errors.forEach(e => console.log(`   - ${e}`));
  }

  console.log('\n📊 Summary:');
  console.log(`   Total cards: 78`);
  console.log(`   Optimized: ${optimized}`);
  console.log(`   Skipped (missing): ${skipped}`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Format: WebP`);
  console.log(`   Size: ${TARGET_WIDTH}x${TARGET_HEIGHT}px`);
  console.log(`   Quality: 85%`);

  if (skipped > 0) {
    console.log('\n💡 Tip: Download missing images from:');
    console.log('   https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck');
  }

  if (optimized === 78) {
    console.log('\n✅ All card images optimized successfully!');
  }
}

// Calculate total size
function calculateTotalSize() {
  const baseDir = path.join(__dirname, '../src/frontend/public/images/cards');
  let totalSize = 0;
  let count = 0;

  Object.keys(CARD_MAPPING).forEach(suit => {
    const suitDir = path.join(baseDir, suit);
    if (!fs.existsSync(suitDir)) return;

    fs.readdirSync(suitDir).forEach(file => {
      if (file.endsWith('.webp')) {
        const filePath = path.join(suitDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        count++;
      }
    });
  });

  if (count > 0) {
    const avgSize = Math.round(totalSize / count / 1024);
    const total = Math.round(totalSize / 1024 / 1024 * 10) / 10;

    console.log('\n💾 Storage:');
    console.log(`   Average per card: ${avgSize}KB`);
    console.log(`   Total size: ${total}MB`);
  }
}

// Run optimizer
optimizeAllImages()
  .then(() => calculateTotalSize())
  .catch(console.error);
