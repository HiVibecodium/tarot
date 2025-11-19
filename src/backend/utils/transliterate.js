/**
 * Transliteration utility for PDF generation
 * Converts Cyrillic to Latin characters
 */

const CYRILLIC_TO_LATIN = {
  'А': 'A', 'а': 'a',
  'Б': 'B', 'б': 'b',
  'В': 'V', 'в': 'v',
  'Г': 'G', 'г': 'g',
  'Д': 'D', 'д': 'd',
  'Е': 'E', 'е': 'e',
  'Ё': 'Yo', 'ё': 'yo',
  'Ж': 'Zh', 'ж': 'zh',
  'З': 'Z', 'з': 'z',
  'И': 'I', 'и': 'i',
  'Й': 'Y', 'й': 'y',
  'К': 'K', 'к': 'k',
  'Л': 'L', 'л': 'l',
  'М': 'M', 'м': 'm',
  'Н': 'N', 'н': 'n',
  'О': 'O', 'о': 'o',
  'П': 'P', 'п': 'p',
  'Р': 'R', 'р': 'r',
  'С': 'S', 'с': 's',
  'Т': 'T', 'т': 't',
  'У': 'U', 'у': 'u',
  'Ф': 'F', 'ф': 'f',
  'Х': 'Kh', 'х': 'kh',
  'Ц': 'Ts', 'ц': 'ts',
  'Ч': 'Ch', 'ч': 'ch',
  'Ш': 'Sh', 'ш': 'sh',
  'Щ': 'Shch', 'щ': 'shch',
  'Ъ': '', 'ъ': '',
  'Ы': 'Y', 'ы': 'y',
  'Ь': '', 'ь': '',
  'Э': 'E', 'э': 'e',
  'Ю': 'Yu', 'ю': 'yu',
  'Я': 'Ya', 'я': 'ya'
};

/**
 * Transliterate Cyrillic text to Latin
 */
function transliterate(text) {
  if (!text) return '';

  return text
    .split('')
    .map(char => CYRILLIC_TO_LATIN[char] || char)
    .join('');
}

/**
 * Transliterate with fallback
 * Returns original if transliteration fails
 */
function safeTransliterate(text) {
  try {
    return transliterate(text);
  } catch (error) {
    console.error('Transliteration error:', error);
    return text;
  }
}

module.exports = {
  transliterate,
  safeTransliterate
};
