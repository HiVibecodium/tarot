import { render, screen, fireEvent, act } from '@testing-library/react';
import Toast from '../Toast';

// Mock timers
jest.useFakeTimers();

describe('Toast Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Rendering', () => {
    it('renders toast message', () => {
      render(<Toast message="Test message" onClose={mockOnClose} />);

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<Toast message="Test" onClose={mockOnClose} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('×')).toBeInTheDocument();
    });

    it('applies correct class for info type', () => {
      const { container } = render(
        <Toast message="Info" type="info" onClose={mockOnClose} />
      );

      expect(container.querySelector('.toast-info')).toBeInTheDocument();
    });

    it('applies correct class for success type', () => {
      const { container } = render(
        <Toast message="Success" type="success" onClose={mockOnClose} />
      );

      expect(container.querySelector('.toast-success')).toBeInTheDocument();
    });

    it('applies correct class for error type', () => {
      const { container } = render(
        <Toast message="Error" type="error" onClose={mockOnClose} />
      );

      expect(container.querySelector('.toast-error')).toBeInTheDocument();
    });

    it('applies correct class for warning type', () => {
      const { container } = render(
        <Toast message="Warning" type="warning" onClose={mockOnClose} />
      );

      expect(container.querySelector('.toast-warning')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('shows success icon for success type', () => {
      render(<Toast message="Success" type="success" onClose={mockOnClose} />);

      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('shows error icon for error type', () => {
      render(<Toast message="Error" type="error" onClose={mockOnClose} />);

      expect(screen.getByText('❌')).toBeInTheDocument();
    });

    it('shows warning icon for warning type', () => {
      render(<Toast message="Warning" type="warning" onClose={mockOnClose} />);

      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('shows info icon for info type', () => {
      render(<Toast message="Info" type="info" onClose={mockOnClose} />);

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });

    it('shows info icon for unknown type', () => {
      render(<Toast message="Unknown" type="unknown" onClose={mockOnClose} />);

      expect(screen.getByText('ℹ️')).toBeInTheDocument();
    });
  });

  describe('Auto-close', () => {
    it('closes after default duration (3000ms)', () => {
      render(<Toast message="Test" onClose={mockOnClose} />);

      expect(mockOnClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('closes after custom duration', () => {
      render(<Toast message="Test" onClose={mockOnClose} duration={5000} />);

      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(mockOnClose).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(2000);
      });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not auto-close when duration is 0', () => {
      render(<Toast message="Test" onClose={mockOnClose} duration={0} />);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does not auto-close when duration is negative', () => {
      render(<Toast message="Test" onClose={mockOnClose} duration={-1} />);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Manual close', () => {
    it('calls onClose when close button clicked', () => {
      render(<Toast message="Test" onClose={mockOnClose} />);

      fireEvent.click(screen.getByRole('button'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cleanup', () => {
    it('clears timer on unmount', () => {
      const { unmount } = render(<Toast message="Test" onClose={mockOnClose} />);

      unmount();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // onClose should not be called after unmount
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
