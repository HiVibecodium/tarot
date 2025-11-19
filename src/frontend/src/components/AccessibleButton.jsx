/**
 * Accessible Button Component
 * Provides keyboard navigation, ARIA labels, and screen reader support
 */

import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const AccessibleButton = forwardRef(({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  ariaLabel,
  ariaDescribedBy,
  className = '',
  icon,
  ...props
}, ref) => {
  const baseClass = 'accessible-btn';
  const variantClass = `${baseClass}--${variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const stateClass = loading ? `${baseClass}--loading` : disabled ? `${baseClass}--disabled` : '';

  const classes = [baseClass, variantClass, sizeClass, stateClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {icon && <span className={`${baseClass}__icon`} aria-hidden="true">{icon}</span>}
      <span className={`${baseClass}__text`}>
        {loading ? 'Загрузка...' : children}
      </span>
      {loading && (
        <span className={`${baseClass}__spinner`} aria-hidden="true">
          <svg className="spinner" viewBox="0 0 50 50" width="20" height="20">
            <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
          </svg>
        </span>
      )}
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

AccessibleButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node
};

export default AccessibleButton;
