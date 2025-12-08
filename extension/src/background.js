/**
 * Background Service Worker
 * Handles extension lifecycle, API calls, and storage
 */

const API_BASE_URL = 'https://ai-tarot-assistant.vercel.app/api';
const LOCAL_API = 'http://localhost:4000/api';

// Use local API in development
const getApiUrl = () => {
  return chrome.runtime.getManifest().version.includes('dev')
    ? LOCAL_API
    : API_BASE_URL;
};

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('🔮 AI Tarot Extension installed');

    // Open onboarding page
    chrome.tabs.create({
      url: chrome.runtime.getURL('public/welcome.html')
    });

    // Initialize storage
    chrome.storage.local.set({
      isAuthenticated: false,
      readingsCount: 0,
      lastReading: null
    });
  } else if (details.reason === 'update') {
    console.log('🔮 AI Tarot Extension updated');
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📬 Message received:', request.action);

  switch (request.action) {
    case 'getReading':
      handleGetReading(request.data, sendResponse);
      return true; // Keep channel open for async response

    case 'checkAuth':
      handleCheckAuth(sendResponse);
      return true;

    case 'login':
      handleLogin(request.credentials, sendResponse);
      return true;

    case 'logout':
      handleLogout(sendResponse);
      return true;

    case 'saveReading':
      handleSaveReading(request.reading, sendResponse);
      return true;

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Handle reading generation
async function handleGetReading(data, sendResponse) {
  try {
    const { productUrl, productName, price, context = 'purchase' } = data;

    // Check authentication
    const auth = await getAuthToken();
    if (!auth) {
      sendResponse({
        success: false,
        error: 'Not authenticated',
        requiresAuth: true
      });
      return;
    }

    // Call API to generate reading
    const response = await fetch(`${getApiUrl()}/readings/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        context,
        productUrl,
        productName,
        price
      })
    });

    const result = await response.json();

    if (result.success) {
      // Save to local storage
      await saveReadingLocally(result.reading);

      sendResponse({
        success: true,
        reading: result.reading
      });
    } else {
      sendResponse({
        success: false,
        error: result.error || 'Failed to generate reading'
      });
    }
  } catch (error) {
    console.error('Error generating reading:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Check authentication status
async function handleCheckAuth(sendResponse) {
  try {
    const auth = await getAuthToken();

    if (!auth) {
      sendResponse({ success: true, isAuthenticated: false });
      return;
    }

    // Verify token with API
    const response = await fetch(`${getApiUrl()}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });

    const result = await response.json();

    sendResponse({
      success: true,
      isAuthenticated: result.success,
      user: result.user
    });
  } catch (error) {
    console.error('Auth check failed:', error);
    sendResponse({
      success: false,
      isAuthenticated: false,
      error: error.message
    });
  }
}

// Handle login
async function handleLogin(credentials, sendResponse) {
  try {
    const response = await fetch(`${getApiUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();

    if (result.success && result.token) {
      // Save auth token
      await chrome.storage.local.set({
        authToken: result.token,
        user: result.user,
        isAuthenticated: true
      });

      sendResponse({
        success: true,
        user: result.user
      });
    } else {
      sendResponse({
        success: false,
        error: result.error || 'Login failed'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Handle logout
async function handleLogout(sendResponse) {
  try {
    await chrome.storage.local.remove(['authToken', 'user', 'isAuthenticated']);

    sendResponse({ success: true });
  } catch (error) {
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Save reading locally
async function handleSaveReading(reading, sendResponse) {
  try {
    await saveReadingLocally(reading);
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Helper: Get auth token from storage
async function getAuthToken() {
  const data = await chrome.storage.local.get(['authToken', 'user']);

  if (!data.authToken) {
    return null;
  }

  return {
    token: data.authToken,
    user: data.user
  };
}

// Helper: Save reading to local storage
async function saveReadingLocally(reading) {
  const data = await chrome.storage.local.get(['readings', 'readingsCount']);

  const readings = data.readings || [];
  const readingsCount = (data.readingsCount || 0) + 1;

  readings.unshift({
    ...reading,
    id: Date.now(),
    timestamp: new Date().toISOString()
  });

  // Keep only last 50 readings
  const trimmedReadings = readings.slice(0, 50);

  await chrome.storage.local.set({
    readings: trimmedReadings,
    readingsCount,
    lastReading: reading
  });
}

// Badge notification
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateBadge') {
    chrome.action.setBadgeText({
      text: request.text || ''
    });
    chrome.action.setBadgeBackgroundColor({
      color: request.color || '#667eea'
    });
  }
});

console.log('🔮 AI Tarot Extension background script loaded');
