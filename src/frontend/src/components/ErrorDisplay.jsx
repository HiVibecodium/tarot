/**
 * Error Display Component
 * Beautiful, actionable error messages
 */

import { useNavigate } from 'react-router-dom';
import { getErrorInfo, getErrorAction, logError } from '../utils/errorHandler';
import './ErrorDisplay.css';

function ErrorDisplay({ error, onRetry, context = {} }) {
  const navigate = useNavigate();

  if (!error) return null;

  // Log error for debugging
  logError(error, context);

  // Get error information
  const errorInfo = getErrorInfo(error);

  // Render action buttons
  const renderActions = () => {
    if (!errorInfo.actions || errorInfo.actions.length === 0) {
      return null;
    }

    return (
      <div className="error-actions">
        {errorInfo.actions.map(actionType => {
          const action = getErrorAction(actionType, navigate);

          if (!action) return null;

          // Custom retry action if provided
          if (actionType === 'retry' && onRetry) {
            return (
              <button
                key={actionType}
                onClick={onRetry}
                className={`btn-${action.variant}`}
              >
                {action.label}
              </button>
            );
          }

          return (
            <button
              key={actionType}
              onClick={action.action}
              className={`btn-${action.variant}`}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`error-display severity-${errorInfo.severity}`}>
      <div className="error-icon">{errorInfo.icon}</div>

      <div className="error-content">
        <h3 className="error-title">{errorInfo.title}</h3>
        <p className="error-message">{errorInfo.message}</p>

        {errorInfo.details && errorInfo.details.length > 0 && (
          <ul className="error-details">
            {errorInfo.details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        )}
      </div>

      {renderActions()}
    </div>
  );
}

/**
 * Inline Error (smaller, for forms)
 */
export function InlineError({ message, icon = '⚠️' }) {
  if (!message) return null;

  return (
    <div className="inline-error">
      <span className="inline-error-icon">{icon}</span>
      <span className="inline-error-message">{message}</span>
    </div>
  );
}

/**
 * Error Page (full screen)
 */
export function ErrorPage({ error, onRetry }) {
  const navigate = useNavigate();
  const errorInfo = error ? getErrorInfo(error) : {
    title: 'Ошибка',
    message: 'Что-то пошло не так',
    icon: '❌',
    actions: ['dashboard']
  };

  return (
    <div className="error-page">
      <div className="error-page-content">
        <div className="error-page-icon">{errorInfo.icon}</div>
        <h1 className="error-page-title">{errorInfo.title}</h1>
        <p className="error-page-message">{errorInfo.message}</p>

        <div className="error-page-actions">
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              Попробовать снова
            </button>
          )}
          <button onClick={() => navigate('/dashboard')} className="btn-secondary">
            На главную
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;
