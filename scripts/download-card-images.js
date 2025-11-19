/**
 * Download Tarot Card Images
 * Downloads Rider-Waite tarot deck images (public domain)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../src/frontend/public/cards');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('✅ Created directory:', OUTPUT_DIR);
}

// GitHub repo with Rider-Waite images (public domain)
const BASE_URL = 'https://raw.githubusercontent.com/dariusk/corpora/master/data/divination/tarot_interpretations.json';

// Alternative: Use Wikipedia Commons
const WIKIMEDIA_BASE = 'https://upload.wikimedia.org/wikipedia/commons/';

// Mapping card IDs to Wikimedia file names
const CARD_IMAGE_MAP = {
  // Major Arcana
  'major-00-fool': '9/90/RWS_Tarot_00_Fool.jpg',
  'major-01-magician': 'd/de/RWS_Tarot_01_Magician.jpg',
  'major-02-priestess': '8/88/RWS_Tarot_02_High_Priestess.jpg',
  'major-03-empress': 'd/d2/RWS_Tarot_03_Empress.jpg',
  'major-04-emperor': 'c/c3/RWS_Tarot_04_Emperor.jpg',
  'major-05-hierophant': '8/8d/RWS_Tarot_05_Hierophant.jpg',
  'major-06-lovers': '3/3a/RWS_Tarot_06_Lovers.jpg',
  'major-07-chariot': '9/9b/RWS_Tarot_07_Chariot.jpg',
  'major-08-strength': 'f/f5/RWS_Tarot_08_Strength.jpg',
  'major-09-hermit': '4/4d/RWS_Tarot_09_Hermit.jpg',
  'major-10-wheel': '3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg',
  'major-11-justice': 'e/e0/RWS_Tarot_11_Justice.jpg',
  'major-12-hanged': '2/2b/RWS_Tarot_12_Hanged_Man.jpg',
  'major-13-death': 'd/d7/RWS_Tarot_13_Death.jpg',
  'major-14-temperance': 'f/f8/RWS_Tarot_14_Temperance.jpg',
  'major-15-devil': '5/55/RWS_Tarot_15_Devil.jpg',
  'major-16-tower': '5/53/RWS_Tarot_16_Tower.jpg',
  'major-17-star': 'd/db/RWS_Tarot_17_Star.jpg',
  'major-18-moon': '7/7f/RWS_Tarot_18_Moon.jpg',
  'major-19-sun': '1/17/RWS_Tarot_19_Sun.jpg',
  'major-20-judgement': 'd/dd/RWS_Tarot_20_Judgement.jpg',
  'major-21-world': 'f/ff/RWS_Tarot_21_World.jpg',

  // Wands
  'wands-ace': '1/11/Wands01.jpg',
  'wands-02': '0/0f/Wands02.jpg',
  'wands-03': 'f/ff/Wands03.jpg',
  'wands-04': 'a/a4/Wands04.jpg',
  'wands-05': '9/9d/Wands05.jpg',
  'wands-06': '3/3b/Wands06.jpg',
  'wands-07': 'e/e4/Wands07.jpg',
  'wands-08': '6/6b/Wands08.jpg',
  'wands-09': '4/4d/Wands09.jpg',
  'wands-10': '0/0b/Wands10.jpg',
  'wands-page': '6/6a/Wands11.jpg',
  'wands-knight': '1/16/Wands12.jpg',
  'wands-queen': '0/0d/Wands13.jpg',
  'wands-king': 'c/ce/Wands14.jpg',

  // Cups
  'cups-ace': '3/36/Cups01.jpg',
  'cups-02': 'f/f8/Cups02.jpg',
  'cups-03': '7/7a/Cups03.jpg',
  'cups-04': '3/35/Cups04.jpg',
  'cups-05': 'd/d7/Cups05.jpg',
  'cups-06': '1/17/Cups06.jpg',
  'cups-07': 'a/ae/Cups07.jpg',
  'cups-08': '6/60/Cups08.jpg',
  'cups-09': '2/24/Cups09.jpg',
  'cups-10': '8/84/Cups10.jpg',
  'cups-page': 'a/ad/Cups11.jpg',
  'cups-knight': 'f/fa/Cups12.jpg',
  'cups-queen': '6/62/Cups13.jpg',
  'cups-king': '0/04/Cups14.jpg',

  // Swords
  'swords-ace': '1/1a/Swords01.jpg',
  'swords-02': '9/9e/Swords02.jpg',
  'swords-03': '0/02/Swords03.jpg',
  'swords-04': 'b/bf/Swords04.jpg',
  'swords-05': '2/23/Swords05.jpg',
  'swords-06': '2/29/Swords06.jpg',
  'swords-07': '3/34/Swords07.jpg',
  'swords-08': 'a/a7/Swords08.jpg',
  'swords-09': '2/2f/Swords09.jpg',
  'swords-10': 'd/d4/Swords10.jpg',
  'swords-page': '4/4c/Swords11.jpg',
  'swords-knight': 'b/b0/Swords12.jpg',
  'swords-queen': 'd/d4/Swords13.jpg',
  'swords-king': '3/33/Swords14.jpg',

  // Pentacles
  'pentacles-ace': 'f/fd/Pents01.jpg',
  'pentacles-02': '9/9f/Pents02.jpg',
  'pentacles-03': '4/42/Pents03.jpg',
  'pentacles-04': '3/35/Pents04.jpg',
  'pentacles-05': '9/96/Pents05.jpg',
  'pentacles-06': 'a/a6/Pents06.jpg',
  'pentacles-07': '6/6a/Pents07.jpg',
  'pentacles-08': '4/49/Pents08.jpg',
  'pentacles-09': 'f/f0/Pents09.jpg',
  'pentacles-10': '4/42/Pents10.jpg',
  'pentacles-page': 'e/ec/Pents11.jpg',
  'pentacles-knight': 'd/d5/Pents12.jpg',
  'pentacles-queen': '8/88/Pents13.jpg',
  'pentacles-king': '1/1c/Pents14.jpg'
};

/**
 * Download single image
 */
function downloadImage(cardId, wikimediaPath) {
  return new Promise((resolve, reject) => {
    const url = `${WIKIMEDIA_BASE}${wikimediaPath}`;
    const outputPath = path.join(OUTPUT_DIR, `${cardId}.jpg`);

    console.log(`Downloading ${cardId}...`);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${cardId}: ${response.statusCode}`));
        return;
      }

      const file = fs.createWriteStream(outputPath);

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`✅ ${cardId} downloaded`);
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Download all images
 */
async function downloadAllImages() {
  console.log('🎴 Starting Tarot Card Images Download...\n');
  console.log(`Downloading to: ${OUTPUT_DIR}\n`);

  let downloaded = 0;
  let failed = 0;

  for (const [cardId, wikimediaPath] of Object.entries(CARD_IMAGE_MAP)) {
    try {
      await downloadImage(cardId, wikimediaPath);
      downloaded++;

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.error(`❌ Failed ${cardId}:`, error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 DOWNLOAD SUMMARY:');
  console.log('='.repeat(50));
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${downloaded + failed}`);
  console.log('='.repeat(50));

  if (downloaded === Object.keys(CARD_IMAGE_MAP).length) {
    console.log('\n🎉 All card images downloaded successfully!\n');
    console.log('📁 Images saved to:', OUTPUT_DIR);
    console.log('\n✨ Ready to use! Restart frontend to see real images.\n');
  } else {
    console.log('\n⚠️  Some downloads failed. You can retry or download manually.\n');
  }
}

// Run if called directly
if (require.main === module) {
  downloadAllImages().catch(error => {
    console.error('❌ Download failed:', error);
    process.exit(1);
  });
}

module.exports = { downloadAllImages };
