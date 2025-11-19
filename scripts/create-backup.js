/**
 * Project Backup Script
 * Creates complete backup of the project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const BACKUP_DIR = path.join(PROJECT_ROOT, 'backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const BACKUP_NAME = `ai-tarot-backup-${TIMESTAMP}`;

console.log('💾 Creating Project Backup...\n');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('✅ Created backup directory');
}

// Get current git status
console.log('📊 Checking git status...');
try {
  const status = execSync('git status --short', { encoding: 'utf-8' });
  if (status.trim()) {
    console.log('⚠️  Warning: You have uncommitted changes:');
    console.log(status);
    console.log('');
  } else {
    console.log('✅ Working directory clean');
  }
} catch (error) {
  console.log('⚠️  Could not check git status');
}

// Get current commit
let currentCommit = 'unknown';
try {
  currentCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  console.log(`📌 Current commit: ${currentCommit}`);
} catch (error) {
  console.log('⚠️  Could not get current commit');
}

// Count files
console.log('\n📁 Counting files...');
const fileCount = {
  total: 0,
  js: 0,
  jsx: 0,
  css: 0,
  json: 0,
  md: 0
};

function countFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build', 'backups'].includes(file)) {
        countFiles(filePath);
      }
    } else {
      fileCount.total++;
      const ext = path.extname(file);
      if (ext === '.js') fileCount.js++;
      if (ext === '.jsx') fileCount.jsx++;
      if (ext === '.css') fileCount.css++;
      if (ext === '.json') fileCount.json++;
      if (ext === '.md') fileCount.md++;
    }
  });
}

countFiles(PROJECT_ROOT);

console.log(`   Total files: ${fileCount.total}`);
console.log(`   JavaScript: ${fileCount.js}`);
console.log(`   React (JSX): ${fileCount.jsx}`);
console.log(`   CSS: ${fileCount.css}`);
console.log(`   JSON: ${fileCount.json}`);
console.log(`   Markdown: ${fileCount.md}`);

// Create backup info file
const backupInfo = {
  timestamp: new Date().toISOString(),
  commit: currentCommit,
  nodeVersion: process.version,
  files: fileCount,
  includes: [
    'Source code (src/)',
    'Configuration files',
    'Documentation (*.md)',
    'Scripts',
    'Git repository',
    'Card images (public/images/cards/)'
  ],
  excludes: [
    'node_modules/',
    'dist/',
    'build/',
    '*.log',
    'Database files (*.json in db/data/)',
    '.env files'
  ]
};

console.log('\n📝 Creating backup info...');
const infoPath = path.join(BACKUP_DIR, `${BACKUP_NAME}-info.json`);
fs.writeFileSync(infoPath, JSON.stringify(backupInfo, null, 2));
console.log(`✅ Backup info: ${BACKUP_NAME}-info.json`);

// Create git bundle (full git history)
console.log('\n📦 Creating git bundle...');
try {
  const bundlePath = path.join(BACKUP_DIR, `${BACKUP_NAME}.bundle`);
  execSync(`git bundle create "${bundlePath}" --all`, { cwd: PROJECT_ROOT });
  const bundleSize = fs.statSync(bundlePath).size;
  console.log(`✅ Git bundle created: ${(bundleSize / 1024 / 1024).toFixed(2)} MB`);
} catch (error) {
  console.log('⚠️  Could not create git bundle:', error.message);
}

// Create simple file backup (no node_modules)
console.log('\n📦 Creating file archive...');
const excludePatterns = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'backups',
  '*.log',
  'src/backend/db/data/*.json'
];

// Use system tar if available (Windows 10+ has tar)
try {
  const archivePath = path.join(BACKUP_DIR, `${BACKUP_NAME}.tar.gz`);

  // Build exclude string
  const excludeArgs = excludePatterns.map(p => `--exclude="${p}"`).join(' ');

  execSync(`tar -czf "${archivePath}" ${excludeArgs} .`, {
    cwd: PROJECT_ROOT,
    stdio: 'inherit'
  });

  const archiveSize = fs.statSync(archivePath).size;
  console.log(`✅ Archive created: ${(archiveSize / 1024 / 1024).toFixed(2)} MB`);
} catch (error) {
  console.log('⚠️  Tar not available, skipping file archive');
  console.log('   (Git bundle is sufficient for restore)');
}

// Summary
console.log('\n🎊 ========================================');
console.log('🎊 BACKUP COMPLETE!');
console.log('🎊 ========================================\n');

console.log('📦 Backup Location:', BACKUP_DIR);
console.log('📝 Backup Name:', BACKUP_NAME);
console.log('');

console.log('📁 Backup Files:');
console.log(`   ${BACKUP_NAME}-info.json - Backup metadata`);
console.log(`   ${BACKUP_NAME}.bundle - Git repository (full history)`);
console.log(`   ${BACKUP_NAME}.tar.gz - Source files (optional)`);
console.log('');

console.log('♻️  To Restore:');
console.log('   1. Clone from bundle: git clone backups/${BACKUP_NAME}.bundle restored-project');
console.log('   2. Or extract tar: tar -xzf backups/${BACKUP_NAME}.tar.gz');
console.log('   3. npm install');
console.log('   4. cd src/frontend && npm install');
console.log('');

console.log('✅ Project safely backed up!');
console.log('');
