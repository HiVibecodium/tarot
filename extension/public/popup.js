/**
 * Popup Script
 * Manages extension popup UI and interactions
 */

let currentUser = null;

// Initialize popup
async function init() {
  console.log('🔮 Initializing popup...');

  // Check authentication
  chrome.runtime.sendMessage({ action: 'checkAuth' }, (response) => {
    if (response.isAuthenticated) {
      currentUser = response.user;
      showAuthenticatedView();
      loadStats();
      loadRecentReadings();
    } else {
      showUnauthenticatedView();
    }
  });

  // Set up event listeners
  setupEventListeners();
}

// Show authenticated view
function showAuthenticatedView() {
  document.getElementById('not-authenticated').classList.add('hidden');
  document.getElementById('auth-state').classList.remove('hidden');
  document.getElementById('stats-section').classList.remove('hidden');
  document.getElementById('recent-section').classList.remove('hidden');
  document.getElementById('actions-section').classList.remove('hidden');

  // Populate user info
  if (currentUser) {
    const initials = currentUser.name
      ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : currentUser.email[0].toUpperCase();

    document.getElementById('user-initials').textContent = initials;
    document.getElementById('user-name').textContent = currentUser.name || 'Пользователь';
    document.getElementById('user-email').textContent = currentUser.email;
  }
}

// Show unauthenticated view
function showUnauthenticatedView() {
  document.getElementById('not-authenticated').classList.remove('hidden');
  document.getElementById('auth-state').classList.add('hidden');
  document.getElementById('stats-section').classList.add('hidden');
  document.getElementById('recent-section').classList.add('hidden');
  document.getElementById('actions-section').classList.add('hidden');
}

// Load statistics
async function loadStats() {
  const data = await chrome.storage.local.get(['readingsCount', 'readings']);

  const readingsCount = data.readingsCount || 0;
  const savedCount = data.readings ? data.readings.length : 0;

  document.getElementById('readings-count').textContent = readingsCount;
  document.getElementById('saved-count').textContent = savedCount;
}

// Load recent readings
async function loadRecentReadings() {
  const data = await chrome.storage.local.get(['readings']);
  const readings = data.readings || [];

  const container = document.getElementById('recent-readings');
  container.innerHTML = '';

  if (readings.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 1rem;">Нет сохранённых раскладов</p>';
    return;
  }

  readings.slice(0, 5).forEach(reading => {
    const item = createReadingItem(reading);
    container.appendChild(item);
  });
}

// Create reading item element
function createReadingItem(reading) {
  const item = document.createElement('div');
  item.className = 'reading-item';

  const cardName = reading.cards && reading.cards[0] ? reading.cards[0].name : 'Неизвестная карта';
  const productName = reading.product ? reading.product.title : 'Покупка';
  const date = reading.timestamp ? new Date(reading.timestamp).toLocaleDateString('ru-RU') : '';

  item.innerHTML = `
    <div class="reading-card">${cardName}</div>
    <div class="reading-product">${productName}</div>
    <div class="reading-date">${date}</div>
  `;

  item.addEventListener('click', () => {
    // Could show reading details or open in main app
    console.log('Reading clicked:', reading);
  });

  return item;
}

// Set up event listeners
function setupEventListeners() {
  // Login button
  document.getElementById('login-btn').addEventListener('click', () => {
    chrome.tabs.create({
      url: 'http://localhost:5173/login'
    });
  });

  // Open app button
  document.getElementById('open-app-btn').addEventListener('click', () => {
    chrome.tabs.create({
      url: 'http://localhost:5173/dashboard'
    });
  });

  // Logout button
  document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      chrome.runtime.sendMessage({ action: 'logout' }, (response) => {
        if (response.success) {
          showUnauthenticatedView();
          currentUser = null;
        }
      });
    }
  });
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
