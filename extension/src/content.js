/**
 * Content Script
 * Detects product pages and injects Tarot reading button
 */

// Marketplace configurations
const MARKETPLACES = {
  amazon: {
    domain: 'amazon.com',
    productSelector: '#dp',
    priceSelector: '.a-price .a-offscreen',
    titleSelector: '#productTitle',
    addButtonSelector: '#add-to-cart-button'
  },
  ozon: {
    domain: 'ozon.ru',
    productSelector: '[data-widget="webProductHeading"]',
    priceSelector: '[data-widget="webPrice"] span',
    titleSelector: 'h1',
    addButtonSelector: '[data-widget="webAddToCart"] button'
  },
  wildberries: {
    domain: 'wildberries.ru',
    productSelector: '.product-page',
    priceSelector: '.price-block__final-price',
    titleSelector: '.product-page__title',
    addButtonSelector: '.btn-main'
  },
  ebay: {
    domain: 'ebay.com',
    productSelector: '#CenterPanelInternal',
    priceSelector: '.x-price-primary',
    titleSelector: '.x-item-title__mainTitle',
    addButtonSelector: '[data-testid="x-atc-cta-btn"]'
  },
  aliexpress: {
    domain: 'aliexpress.com',
    productSelector: '.product-main',
    priceSelector: '.product-price-value',
    titleSelector: '.product-title-text',
    addButtonSelector: '.add-to-cart-button'
  }
};

// Detect current marketplace
function detectMarketplace() {
  const hostname = window.location.hostname;

  for (const [key, config] of Object.entries(MARKETPLACES)) {
    if (hostname.includes(config.domain)) {
      return { name: key, config };
    }
  }

  return null;
}

// Extract product information
function extractProductInfo(marketplace) {
  const { config } = marketplace;

  try {
    const titleElement = document.querySelector(config.titleSelector);
    const priceElement = document.querySelector(config.priceSelector);

    return {
      title: titleElement?.textContent?.trim() || 'Неизвестный товар',
      price: priceElement?.textContent?.trim() || 'Цена не указана',
      url: window.location.href,
      marketplace: marketplace.name
    };
  } catch (error) {
    console.error('Error extracting product info:', error);
    return null;
  }
}

// Create Tarot reading button
function createTarotButton(marketplace) {
  const button = document.createElement('button');
  button.id = 'tarot-reading-btn';
  button.className = 'tarot-btn';
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Совет Таро</span>
  `;

  button.addEventListener('click', () => handleTarotClick(marketplace));

  return button;
}

// Handle Tarot button click
async function handleTarotClick(marketplace) {
  const button = document.getElementById('tarot-reading-btn');
  button.disabled = true;
  button.innerHTML = '<span class="spinner"></span> Загрузка...';

  try {
    const productInfo = extractProductInfo(marketplace);

    if (!productInfo) {
      showNotification('Не удалось определить информацию о товаре', 'error');
      return;
    }

    // Request reading from background script
    chrome.runtime.sendMessage({
      action: 'getReading',
      data: {
        productUrl: productInfo.url,
        productName: productInfo.title,
        price: productInfo.price,
        context: 'purchase'
      }
    }, (response) => {
      if (response.requiresAuth) {
        showLoginModal();
      } else if (response.success) {
        showReadingModal(response.reading, productInfo);
      } else {
        showNotification(response.error || 'Ошибка при получении расклада', 'error');
      }

      // Reset button
      button.disabled = false;
      button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Совет Таро</span>
      `;
    });
  } catch (error) {
    console.error('Error getting reading:', error);
    showNotification('Произошла ошибка', 'error');

    button.disabled = false;
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Совет Таро</span>
    `;
  }
}

// Show reading in modal
function showReadingModal(reading, productInfo) {
  // Remove existing modal if any
  const existingModal = document.getElementById('tarot-reading-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'tarot-reading-modal';
  modal.className = 'tarot-modal';
  modal.innerHTML = `
    <div class="tarot-modal-overlay"></div>
    <div class="tarot-modal-content">
      <button class="tarot-modal-close">&times;</button>

      <div class="tarot-modal-header">
        <h2>🔮 Совет Таро</h2>
        <p class="product-name">${productInfo.title}</p>
        <p class="product-price">${productInfo.price}</p>
      </div>

      <div class="tarot-modal-body">
        <div class="tarot-card-display">
          <div class="card ${reading.cards[0].isReversed ? 'reversed' : ''}">
            <h3>${reading.cards[0].name}</h3>
            <p class="card-position">${reading.cards[0].isReversed ? 'Перевёрнутая' : 'Прямая'}</p>
          </div>
        </div>

        <div class="tarot-interpretation">
          <h4>Интерпретация:</h4>
          <p>${reading.interpretation || reading.cards[0].interpretation}</p>
        </div>

        <div class="tarot-advice">
          <h4>Совет:</h4>
          <p>${reading.advice || 'Прислушайтесь к своей интуиции'}</p>
        </div>
      </div>

      <div class="tarot-modal-footer">
        <button class="btn-secondary" id="save-reading-btn">Сохранить</button>
        <button class="btn-primary" id="close-modal-btn">Закрыть</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners
  modal.querySelector('.tarot-modal-close').addEventListener('click', () => modal.remove());
  modal.querySelector('.tarot-modal-overlay').addEventListener('click', () => modal.remove());
  modal.querySelector('#close-modal-btn').addEventListener('click', () => modal.remove());
  modal.querySelector('#save-reading-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      action: 'saveReading',
      reading: {
        ...reading,
        product: productInfo
      }
    }, (response) => {
      if (response.success) {
        showNotification('Расклад сохранён', 'success');
      }
    });
  });

  // Show modal with animation
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
}

// Show login modal
function showLoginModal() {
  const modal = document.createElement('div');
  modal.id = 'tarot-login-modal';
  modal.className = 'tarot-modal';
  modal.innerHTML = `
    <div class="tarot-modal-overlay"></div>
    <div class="tarot-modal-content tarot-login">
      <button class="tarot-modal-close">&times;</button>

      <div class="tarot-modal-header">
        <h2>🔮 Вход в AI Tarot</h2>
        <p>Войдите, чтобы получить расклад</p>
      </div>

      <div class="tarot-modal-body">
        <p class="login-message">
          Для использования расширения необходимо войти в свой аккаунт AI Tarot Decision Assistant
        </p>

        <div class="login-buttons">
          <a href="http://localhost:5173/login" target="_blank" class="btn-primary">
            Открыть страницу входа
          </a>
          <button class="btn-secondary" id="close-login-btn">Отмена</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.tarot-modal-close').addEventListener('click', () => modal.remove());
  modal.querySelector('.tarot-modal-overlay').addEventListener('click', () => modal.remove());
  modal.querySelector('#close-login-btn').addEventListener('click', () => modal.remove());

  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `tarot-notification tarot-notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add('show');
  });

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Inject button into page
function injectTarotButton(marketplace) {
  const { config } = marketplace;
  const targetElement = document.querySelector(config.addButtonSelector);

  if (!targetElement) {
    console.warn('Could not find target element for button injection');
    return;
  }

  const button = createTarotButton(marketplace);

  // Insert button after add-to-cart button
  targetElement.parentNode.insertBefore(button, targetElement.nextSibling);

  console.log('🔮 Tarot button injected');
}

// Initialize extension on product pages
function init() {
  const marketplace = detectMarketplace();

  if (!marketplace) {
    console.log('Not a supported marketplace');
    return;
  }

  console.log(`🔮 Detected marketplace: ${marketplace.name}`);

  // Check if we're on a product page
  const productPage = document.querySelector(marketplace.config.productSelector);

  if (!productPage) {
    console.log('Not a product page');
    return;
  }

  // Wait for page to fully load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => injectTarotButton(marketplace), 1000);
    });
  } else {
    setTimeout(() => injectTarotButton(marketplace), 1000);
  }
}

// Start
init();

console.log('🔮 AI Tarot content script loaded');
