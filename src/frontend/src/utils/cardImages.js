/**
 * Card Image Utilities
 * Handles card image paths and fallbacks
 */

/**
 * Get card image path based on card data
 */
export function getCardImagePath(card) {
  if (!card) return '/images/cards/placeholder.webp';

  // Determine suit
  let suit = 'major';
  if (card.suit) {
    suit = card.suit.toLowerCase();
  } else if (card._id) {
    // Extract suit from _id (e.g., "wands-03" → "wands")
    const parts = card._id.split('-');
    if (parts.length > 1 && ['wands', 'cups', 'swords', 'pentacles'].includes(parts[0])) {
      suit = parts[0];
    }
  }

  // Determine card ID for filename
  let cardId = '';

  if (card._id) {
    // Use _id directly for filename
    const parts = card._id.split('-');
    if (parts.length > 1) {
      cardId = parts[1]; // e.g., "wands-03" → "03"
    } else {
      cardId = parts[0]; // e.g., "00" for fool
    }
  } else if (card.number !== undefined) {
    // Use number
    cardId = String(card.number).padStart(2, '0');
  }

  // Handle Major Arcana special cases
  if (suit === 'major') {
    if (card.name?.includes('Шут') || card.name?.includes('Fool')) cardId = '00';
    else if (card.name?.includes('Маг') || card.name?.includes('Magician')) cardId = '01';
    else if (card.name?.includes('Верховная Жрица') || card.name?.includes('High Priestess')) cardId = '02';
    else if (card.name?.includes('Императрица') || card.name?.includes('Empress')) cardId = '03';
    else if (card.name?.includes('Император') || card.name?.includes('Emperor')) cardId = '04';
    else if (card.name?.includes('Иерофант') || card.name?.includes('Hierophant')) cardId = '05';
    else if (card.name?.includes('Влюблённые') || card.name?.includes('Lovers')) cardId = '06';
    else if (card.name?.includes('Колесница') || card.name?.includes('Chariot')) cardId = '07';
    else if (card.name?.includes('Сила') || card.name?.includes('Strength')) cardId = '08';
    else if (card.name?.includes('Отшельник') || card.name?.includes('Hermit')) cardId = '09';
    else if (card.name?.includes('Колесо') || card.name?.includes('Wheel')) cardId = '10';
    else if (card.name?.includes('Справедливость') || card.name?.includes('Justice')) cardId = '11';
    else if (card.name?.includes('Повешенный') || card.name?.includes('Hanged')) cardId = '12';
    else if (card.name?.includes('Смерть') || card.name?.includes('Death')) cardId = '13';
    else if (card.name?.includes('Умеренность') || card.name?.includes('Temperance')) cardId = '14';
    else if (card.name?.includes('Дьявол') || card.name?.includes('Devil')) cardId = '15';
    else if (card.name?.includes('Башня') || card.name?.includes('Tower')) cardId = '16';
    else if (card.name?.includes('Звезда') || card.name?.includes('Star')) cardId = '17';
    else if (card.name?.includes('Луна') || card.name?.includes('Moon')) cardId = '18';
    else if (card.name?.includes('Солнце') || card.name?.includes('Sun')) cardId = '19';
    else if (card.name?.includes('Суд') || card.name?.includes('Judgement')) cardId = '20';
    else if (card.name?.includes('Мир') || card.name?.includes('World')) cardId = '21';
  }

  // Handle court cards for Minor Arcana
  if (['wands', 'cups', 'swords', 'pentacles'].includes(suit)) {
    if (card.name?.includes('Туз') || card.name?.includes('Ace')) cardId = 'ace';
    else if (card.name?.includes('Паж') || card.name?.includes('Page')) cardId = 'page';
    else if (card.name?.includes('Рыцарь') || card.name?.includes('Knight')) cardId = 'knight';
    else if (card.name?.includes('Королева') || card.name?.includes('Queen')) cardId = 'queen';
    else if (card.name?.includes('Король') || card.name?.includes('King')) cardId = 'king';
    else if (card.number) {
      // Number cards (2-10)
      cardId = String(card.number).padStart(2, '0');
    }
  }

  if (!cardId) {
    return '/cards/placeholder.svg';
  }

  // Use new SVG format: /cards/{suit}-{id}.svg or /cards/major-{id}.svg
  if (suit === 'major') {
    return `/cards/major-${cardId}.svg`;
  } else {
    return `/cards/${suit}-${cardId}.svg`;
  }
}

/**
 * Preload card image
 */
export function preloadCardImage(imagePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(imagePath);
    img.onerror = () => reject(new Error(`Failed to load: ${imagePath}`));
    img.src = imagePath;
  });
}

/**
 * Get fallback placeholder path
 */
export function getFallbackImagePath() {
  return '/cards/major-00-fool.svg'; // Use Fool card as fallback
}

/**
 * Check if image exists (async)
 */
export async function checkImageExists(imagePath) {
  try {
    await preloadCardImage(imagePath);
    return true;
  } catch {
    return false;
  }
}
