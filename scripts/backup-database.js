/**
 * Database Backup Script
 * Creates a timestamped backup of all JSON database files
 */

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'src', 'backend', 'db', 'data');
const backupBaseDir = path.join(__dirname, '..', 'backups');
const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const backupDir = path.join(backupBaseDir, `database-${timestamp}`);

console.log('💾 Creating Database Backup...\n');

// Create backup directory
if (!fs.existsSync(backupBaseDir)) {
  fs.mkdirSync(backupBaseDir, { recursive: true });
}

fs.mkdirSync(backupDir, { recursive: true });

// Get all JSON files
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));

console.log(`📁 Found ${files.length} database files:`);
files.forEach(f => console.log(`   - ${f}`));
console.log('');

// Copy files and calculate sizes
let totalSize = 0;
const backupInfo = {
  timestamp: new Date().toISOString(),
  files: [],
  totalSize: 0
};

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(backupDir, file);

  const content = fs.readFileSync(sourcePath, 'utf8');
  fs.writeFileSync(destPath, content);

  const stats = fs.statSync(destPath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  totalSize += stats.size;

  // Parse and count records
  let recordCount = 0;
  try {
    const data = JSON.parse(content);
    recordCount = Array.isArray(data) ? data.length : Object.keys(data).length;
  } catch (e) {
    recordCount = 'N/A';
  }

  backupInfo.files.push({
    name: file,
    size: stats.size,
    records: recordCount
  });

  console.log(`✅ ${file.padEnd(20)} - ${sizeKB} KB (${recordCount} records)`);
});

backupInfo.totalSize = totalSize;

// Save backup info
const infoPath = path.join(backupDir, 'backup-info.json');
fs.writeFileSync(infoPath, JSON.stringify(backupInfo, null, 2));

console.log('\n' + '='.repeat(50));
console.log('✅ DATABASE BACKUP COMPLETE!');
console.log('='.repeat(50));
console.log(`📦 Location: ${backupDir}`);
console.log(`📊 Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
console.log(`📝 Files: ${files.length}`);
console.log('');
console.log('♻️  To Restore:');
console.log(`   Copy files from ${backupDir}`);
console.log(`   to src/backend/db/data/`);
console.log('');
