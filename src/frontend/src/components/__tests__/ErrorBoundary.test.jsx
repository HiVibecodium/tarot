import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Content rendered successfully</div>;
};

// Suppress console.error for cleaner test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Normal rendering', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Content rendered successfully')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('catches error and displays fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
      expect(screen.queryByText('Content rendered successfully')).not.toBeInTheDocument();
    });

    it('displays error message', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Произошла непредвиденная ошибка/)).toBeInTheDocument();
    });

    it('displays crystal ball icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('🔮')).toBeInTheDocument();
    });

    it('shows hint about clearing cache', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/очистить кэш браузера/)).toBeInTheDocument();
    });
  });

  describe('Custom fallback', () => {
    it('renders custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<div>Custom error message</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.queryByText('Что-то пошло не так')).not.toBeInTheDocument();
    });
  });

  describe('Action buttons', () => {
    it('renders all action buttons', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Попробовать снова')).toBeInTheDocument();
      expect(screen.getByText('На главную')).toBeInTheDocument();
      expect(screen.getByText('Перезагрузить страницу')).toBeInTheDocument();
    });

    it('retry button is clickable', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();

      // Click retry - verify button exists and is clickable
      const retryButton = screen.getByText('Попробовать снова');
      expect(retryButton).toBeInTheDocument();
      fireEvent.click(retryButton);
      // After clicking, the error boundary resets state internally
    });

    it('reload button is clickable', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByText('Перезагрузить страницу');
      expect(reloadButton).toBeInTheDocument();
      // Just verify button exists and can be clicked
      expect(reloadButton.tagName).toBe('BUTTON');
    });

    it('home button is clickable', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const homeButton = screen.getByText('На главную');
      expect(homeButton).toBeInTheDocument();
      expect(homeButton.tagName).toBe('BUTTON');
    });
  });

  describe('Static method', () => {
    it('getDerivedStateFromError returns correct state', () => {
      const error = new Error('Test error');
      const result = ErrorBoundary.getDerivedStateFromError(error);

      expect(result).toEqual({ hasError: true, error });
    });
  });
});
