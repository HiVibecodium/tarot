/**
 * Password Validation Utility
 * Enforces strong password requirements
 */

/**
 * Password requirements
 */
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: false, // Optional for better UX
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Optional
};

/**
 * Common weak passwords to block
 */
const WEAK_PASSWORDS = [
  'password', 'password123', '12345678', 'qwerty', 'abc123',
  'password1', '111111', '123123', '1234567', '1234567890',
  'qwerty123', 'password12', 'admin', 'admin123', 'letmein',
  'welcome', 'monkey', 'dragon', 'master', 'sunshine',
  'princess', 'football', 'iloveyou', 'trustno1', 'baseball'
];

/**
 * Validate password strength
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validatePassword(password) {
  const errors = [];

  // Check if password exists
  if (!password) {
    return {
      valid: false,
      errors: ['Пароль обязателен']
    };
  }

  // Check type
  if (typeof password !== 'string') {
    return {
      valid: false,
      errors: ['Неверный формат пароля']
    };
  }

  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Пароль должен содержать минимум ${PASSWORD_REQUIREMENTS.minLength} символов`);
  }

  // Check maximum length
  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(`Пароль слишком длинный (максимум ${PASSWORD_REQUIREMENTS.maxLength} символов)`);
  }

  // Check for letters
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-zа-я]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну букву');
  }

  // Check for uppercase (optional)
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-ZА-Я]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву');
  }

  // Check for numbers
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру');
  }

  // Check for special characters (optional)
  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы один специальный символ');
  }

  // Check against weak passwords
  const lowerPassword = password.toLowerCase();
  if (WEAK_PASSWORDS.includes(lowerPassword)) {
    errors.push('Этот пароль слишком простой. Выберите более сложный пароль');
  }

  // Check for sequential characters
  if (/012|123|234|345|456|567|678|789|890|abc|bcd|cde/.test(lowerPassword)) {
    errors.push('Избегайте последовательных символов в пароле');
  }

  // Check for repeating characters
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Избегайте повторяющихся символов в пароле');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get password strength score (0-100)
 */
function getPasswordStrength(password) {
  if (!password) return 0;

  let score = 0;

  // Length bonus
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 15;

  // Penalize weak patterns
  if (WEAK_PASSWORDS.includes(password.toLowerCase())) score -= 50;
  if (/(.)\1{2,}/.test(password)) score -= 10; // Repeating chars
  if (/012|123|234|345/.test(password)) score -= 10; // Sequential

  return Math.max(0, Math.min(100, score));
}

/**
 * Get password strength label
 */
function getPasswordStrengthLabel(score) {
  if (score < 40) return { label: 'Слабый', color: '#e74c3c' };
  if (score < 60) return { label: 'Средний', color: '#f39c12' };
  if (score < 80) return { label: 'Хороший', color: '#3498db' };
  return { label: 'Отличный', color: '#27ae60' };
}

/**
 * Validate password and throw error if invalid
 */
function validatePasswordOrThrow(password) {
  const validation = validatePassword(password);

  if (!validation.valid) {
    const error = new Error(validation.errors[0]);
    error.statusCode = 400;
    error.code = 'WEAK_PASSWORD';
    error.details = validation.errors;
    throw error;
  }

  return true;
}

module.exports = {
  validatePassword,
  validatePasswordOrThrow,
  getPasswordStrength,
  getPasswordStrengthLabel,
  PASSWORD_REQUIREMENTS,
  WEAK_PASSWORDS
};
