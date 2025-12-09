import { render, screen, fireEvent, act } from '@testing-library/react';
import LazyImage from '../LazyImage';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

describe('LazyImage Component', () => {
  beforeEach(() => {
    mockIntersectionObserver.mockClear();
  });

  describe('Rendering', () => {
    it('renders container with correct class', () => {
      render(<LazyImage src="/test.jpg" alt="Test" className="custom-class" />);

      const container = document.querySelector('.lazy-image-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('custom-class');
    });

    it('renders placeholder initially', () => {
      render(<LazyImage src="/test.jpg" alt="Test" />);

      const placeholder = document.querySelector('.lazy-image-placeholder');
      expect(placeholder).toBeInTheDocument();
    });

    it('renders custom placeholder when provided', () => {
      render(
        <LazyImage
          src="/test.jpg"
          alt="Test"
          placeholder={<div data-testid="custom-placeholder">Loading...</div>}
        />
      );

      expect(screen.getByTestId('custom-placeholder')).toBeInTheDocument();
    });

    it('applies width and height styles', () => {
      render(<LazyImage src="/test.jpg" alt="Test" width={200} height={300} />);

      const container = document.querySelector('.lazy-image-container');
      expect(container).toHaveStyle({ width: '200px', height: '300px' });
    });
  });

  describe('Intersection Observer', () => {
    it('sets up IntersectionObserver on mount', () => {
      render(<LazyImage src="/test.jpg" alt="Test" />);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          rootMargin: '50px',
          threshold: 0.01,
        })
      );
    });

    it('observes the container element', () => {
      const observeMock = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: observeMock,
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      });

      render(<LazyImage src="/test.jpg" alt="Test" />);

      expect(observeMock).toHaveBeenCalled();
    });

    it('disconnects observer on unmount', () => {
      const disconnectMock = jest.fn();
      mockIntersectionObserver.mockReturnValue({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: disconnectMock,
      });

      const { unmount } = render(<LazyImage src="/test.jpg" alt="Test" />);
      unmount();

      expect(disconnectMock).toHaveBeenCalled();
    });

    it('loads image when element enters viewport', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(<LazyImage src="/test.jpg" alt="Test image" />);

      // Initially no image
      expect(screen.queryByRole('img')).not.toBeInTheDocument();

      // Simulate intersection wrapped in act
      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      // Image should now be rendered
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByAltText('Test image')).toBeInTheDocument();
    });
  });

  describe('Image Loading', () => {
    it('shows loading state initially', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(<LazyImage src="/test.jpg" alt="Test" />);

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      const img = screen.getByRole('img');
      expect(img).toHaveClass('loading');
    });

    it('shows loaded state after image loads', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(<LazyImage src="/test.jpg" alt="Test" />);

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      const img = screen.getByRole('img');

      act(() => {
        fireEvent.load(img);
      });

      expect(img).toHaveClass('loaded');
    });

    it('calls onLoad callback when image loads', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const onLoad = jest.fn();
      render(<LazyImage src="/test.jpg" alt="Test" onLoad={onLoad} />);

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      const img = screen.getByRole('img');

      act(() => {
        fireEvent.load(img);
      });

      expect(onLoad).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('uses fallback src on error', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(
        <LazyImage
          src="/invalid.jpg"
          alt="Test"
          fallbackSrc="/fallback.jpg"
        />
      );

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      const img = screen.getByRole('img');

      act(() => {
        fireEvent.error(img);
      });

      expect(img).toHaveAttribute('src', '/fallback.jpg');
    });

    it('calls onError callback on error', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      const onError = jest.fn();
      render(<LazyImage src="/invalid.jpg" alt="Test" onError={onError} />);

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      const img = screen.getByRole('img');

      act(() => {
        fireEvent.error(img);
      });

      expect(onError).toHaveBeenCalled();
    });

    it('uses default fallback when not specified', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(<LazyImage src="/invalid.jpg" alt="Test" />);

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      const img = screen.getByRole('img');

      act(() => {
        fireEvent.error(img);
      });

      expect(img).toHaveAttribute('src', '/cards/placeholder.svg');
    });
  });

  describe('Accessibility', () => {
    it('has proper alt attribute', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(<LazyImage src="/test.jpg" alt="Descriptive alt text" />);

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      expect(screen.getByAltText('Descriptive alt text')).toBeInTheDocument();
    });

    it('has lazy loading attribute', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(<LazyImage src="/test.jpg" alt="Test" />);

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('has async decoding attribute', () => {
      let intersectionCallback;
      mockIntersectionObserver.mockImplementation((callback) => {
        intersectionCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });

      render(<LazyImage src="/test.jpg" alt="Test" />);

      act(() => {
        intersectionCallback([{ isIntersecting: true }]);
      });

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });
});
