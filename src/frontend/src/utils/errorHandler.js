/**
 * Error Handling Utility
 * Categorizes errors and provides user-friendly messages
 */

/**
 * Get user-friendly error message with actions
 */
export function getErrorInfo(error) {
  // Network errors (no response)
  if (!error.response) {
    return {
      type: 'network',
      title: 'Нет соединения',
      message: 'Проверьте интернет-соединение и попробуйте снова.',
      icon: '📡',
      actions: ['retry'],
      severity: 'error'
    };
  }

  const status = error.response?.status;
  const errorCode = error.response?.data?.error?.code;
  const errorMessage = error.response?.data?.error?.message;

  // Authentication errors (401)
  if (status === 401) {
    return {
      type: 'auth',
      title: 'Требуется вход',
      message: errorMessage || 'Войдите в аккаунт для продолжения.',
      icon: '🔐',
      actions: ['login'],
      severity: 'warning'
    };
  }

  // Permission errors (403)
  if (status === 403) {
    if (errorCode === 'PREMIUM_REQUIRED') {
      return {
        type: 'premium',
        title: 'Премиум функция',
        message: errorMessage || 'Эта функция доступна только премиум подписчикам.',
        icon: '👑',
        actions: ['upgrade'],
        severity: 'info'
      };
    }

    return {
      type: 'forbidden',
      title: 'Доступ запрещён',
      message: errorMessage || 'У вас нет прав для этого действия.',
      icon: '⛔',
      actions: [],
      severity: 'error'
    };
  }

  // Not found errors (404)
  if (status === 404) {
    return {
      type: 'notfound',
      title: 'Не найдено',
      message: errorMessage || 'Запрашиваемый ресурс не найден.',
      icon: '🔍',
      actions: ['back'],
      severity: 'warning'
    };
  }

  // Validation errors (400)
  if (status === 400) {
    if (errorCode === 'WEAK_PASSWORD') {
      return {
        type: 'validation',
        title: 'Слабый пароль',
        message: errorMessage || 'Выберите более сложный пароль.',
        icon: '🔒',
        actions: ['retry'],
        severity: 'warning',
        details: error.response?.data?.error?.details
      };
    }

    if (errorCode === 'DAILY_LIMIT_REACHED') {
      return {
        type: 'limit',
        title: 'Дневной лимит',
        message: errorMessage || 'Вы уже получили расклад дня.',
        icon: '⏰',
        actions: ['upgrade'],
        severity: 'info'
      };
    }

    return {
      type: 'validation',
      title: 'Ошибка ввода',
      message: errorMessage || 'Проверьте введённые данные.',
      icon: '⚠️',
      actions: ['retry'],
      severity: 'warning'
    };
  }

  // Rate limit errors (429)
  if (status === 429) {
    return {
      type: 'ratelimit',
      title: 'Слишком много запросов',
      message: errorMessage || 'Подождите немного и попробуйте снова.',
      icon: '⏱️',
      actions: [],
      severity: 'warning'
    };
  }

  // Server errors (500+)
  if (status >= 500) {
    return {
      type: 'server',
      title: 'Ошибка сервера',
      message: 'Что-то пошло не так. Мы уже работаем над этим.',
      icon: '🔧',
      actions: ['retry', 'support'],
      severity: 'error'
    };
  }

  // Default error
  return {
    type: 'unknown',
    title: 'Ошибка',
    message: errorMessage || 'Произошла непредвиденная ошибка.',
    icon: '❌',
    actions: ['retry'],
    severity: 'error'
  };
}

/**
 * Get action config for error
 */
export function getErrorAction(actionType, navigate) {
  const actions = {
    retry: {
      label: 'Попробовать снова',
      variant: 'primary',
      action: () => window.location.reload()
    },
    login: {
      label: 'Войти',
      variant: 'primary',
      action: () => navigate('/login')
    },
    upgrade: {
      label: 'Узнать о Premium',
      variant: 'premium',
      action: () => navigate('/premium')
    },
    back: {
      label: 'Назад',
      variant: 'secondary',
      action: () => navigate(-1)
    },
    support: {
      label: 'Связаться с поддержкой',
      variant: 'secondary',
      action: () => {
        window.open('mailto:support@tarot-assistant.com?subject=Ошибка в приложении');
      }
    },
    dashboard: {
      label: 'На главную',
      variant: 'secondary',
      action: () => navigate('/dashboard')
    }
  };

  return actions[actionType];
}

/**
 * Log error for debugging
 */
export function logError(error, context = {}) {
  if (import.meta.env.MODE === 'development') {
    console.group('🐛 Error Details');
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Status:', error.response?.status);
    console.log('Code:', error.response?.data?.error?.code);
    console.log('Message:', error.response?.data?.error?.message);
    console.groupEnd();
  }

  // Send to Sentry in production
  if (import.meta.env.VITE_SENTRY_ENABLED === 'true') {
    // Sentry.captureException(error, { extra: context });
  }
}
