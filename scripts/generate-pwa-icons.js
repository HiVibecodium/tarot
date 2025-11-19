/**
 * Generate PWA Icons from SVG
 * Generates all required icon formats for Progressive Web App
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.join(__dirname, '../src/frontend/public/tarot-icon.svg');
const outputDir = path.join(__dirname, '../src/frontend/public');

// Icon sizes to generate
const icons = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

async function generateIcons() {
  console.log('🎨 Starting PWA icon generation...\n');

  // Check if source SVG exists
  if (!fs.existsSync(inputSvg)) {
    console.error(`❌ Source SVG not found: ${inputSvg}`);
    process.exit(1);
  }

  console.log(`📄 Source: ${inputSvg}`);
  console.log(`📁 Output: ${outputDir}\n`);

  // Generate each icon size
  for (const icon of icons) {
    const outputPath = path.join(outputDir, icon.name);

    try {
      await sharp(inputSvg)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 102, g: 126, b: 234, alpha: 1 } // #667eea
        })
        .png()
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`✅ ${icon.name.padEnd(25)} ${icon.size}x${icon.size}  (${(stats.size / 1024).toFixed(1)}KB)`);
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
    }
  }

  // Generate multi-resolution favicon.ico
  console.log('\n🔧 Generating favicon.ico...');

  try {
    // Generate 32x32 ICO (most common size)
    const icoPath = path.join(outputDir, 'favicon.ico');
    await sharp(inputSvg)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 102, g: 126, b: 234, alpha: 1 }
      })
      .png()
      .toFile(icoPath);

    const stats = fs.statSync(icoPath);
    console.log(`✅ favicon.ico               32x32   (${(stats.size / 1024).toFixed(1)}KB)`);
  } catch (error) {
    console.error(`❌ Failed to generate favicon.ico:`, error.message);
  }

  console.log('\n🎉 Icon generation complete!\n');

  // Verify all files exist
  console.log('📋 Verification:');
  const allFiles = [...icons.map(i => i.name), 'favicon.ico'];
  let allExist = true;

  for (const fileName of allFiles) {
    const filePath = path.join(outputDir, fileName);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${fileName}`);
    if (!exists) allExist = false;
  }

  if (allExist) {
    console.log('\n✅ All PWA icons generated successfully!');
    console.log('\n📦 Next steps:');
    console.log('1. Build frontend: cd src/frontend && npm run build');
    console.log('2. Check icons in dist/ folder');
    console.log('3. Deploy to production');
  } else {
    console.log('\n⚠️  Some icons failed to generate. Check errors above.');
    process.exit(1);
  }
}

// Run
generateIcons().catch(error => {
  console.error('❌ Icon generation failed:', error);
  process.exit(1);
});
