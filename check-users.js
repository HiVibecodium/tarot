const fs = require('fs');
const users = JSON.parse(fs.readFileSync('src/backend/db/data/users.json', 'utf-8'));

console.log('Total users:', users.length);
users.forEach((u, i) => {
  console.log(`\nUser ${i + 1}:`);
  console.log('- Email:', u.email);
  console.log('- Has stats:', !!u.stats);
  if (u.stats) {
    console.log('- Total readings:', u.stats.totalReadings);
    console.log('- Current streak:', u.stats.currentStreak);
  }
  console.log('- Has astrologyProfile:', !!u.astrologyProfile);
  if (u.astrologyProfile) {
    console.log('- Astrology calculated:', u.astrologyProfile.calculated);
  }
});
