import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MoonPhase from '../MoonPhase';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Wrapper component with Router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('MoonPhase Component', () => {
  const mockMoonData = {
    phaseName: 'Полнолуние',
    emoji: '🌕',
    illumination: 100,
    description: 'Пик энергии, завершение и озарение',
    energy: 'Максимум силы, осознание, празднование',
    recommendations: {
      tarot: '🔮 ЛУЧШЕЕ время для раскладов!',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockMoonData,
      },
    });
  });

  describe('Loading state', () => {
    it('shows loading state initially', () => {
      // Make axios hang
      axios.get.mockImplementation(() => new Promise(() => {}));

      renderWithRouter(<MoonPhase />);

      expect(screen.getByText('Загрузка...')).toBeInTheDocument();
      expect(screen.getByText('🌙')).toBeInTheDocument();
    });
  });

  describe('Successful data load', () => {
    it('displays moon phase name', async () => {
      renderWithRouter(<MoonPhase />);

      await waitFor(() => {
        expect(screen.getByText('Полнолуние')).toBeInTheDocument();
      });
    });

    it('displays moon emoji', async () => {
      renderWithRouter(<MoonPhase />);

      await waitFor(() => {
        expect(screen.getByText('🌕')).toBeInTheDocument();
      });
    });

    it('displays illumination percentage for medium/large size', async () => {
      renderWithRouter(<MoonPhase size="medium" />);

      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
      });
    });

    it('hides illumination for small size', async () => {
      renderWithRouter(<MoonPhase size="small" />);

      await waitFor(() => {
        expect(screen.getByText('🌕')).toBeInTheDocument();
      });

      expect(screen.queryByText('100%')).not.toBeInTheDocument();
    });
  });

  describe('Detailed view', () => {
    it('shows description when showDetails is true', async () => {
      renderWithRouter(<MoonPhase showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText('Пик энергии, завершение и озарение')).toBeInTheDocument();
      });
    });

    it('shows energy when showDetails is true', async () => {
      renderWithRouter(<MoonPhase showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText(/Энергия:/)).toBeInTheDocument();
        expect(screen.getByText(/Максимум силы/)).toBeInTheDocument();
      });
    });

    it('shows tarot recommendation when showDetails is true', async () => {
      renderWithRouter(<MoonPhase showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText('🔮 ЛУЧШЕЕ время для раскладов!')).toBeInTheDocument();
      });
    });

    it('hides details when showDetails is false', async () => {
      renderWithRouter(<MoonPhase showDetails={false} />);

      await waitFor(() => {
        expect(screen.getByText('Полнолуние')).toBeInTheDocument();
      });

      expect(screen.queryByText('Пик энергии, завершение и озарение')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to moon calendar on click', async () => {
      renderWithRouter(<MoonPhase />);

      await waitFor(() => {
        expect(screen.getByText('Полнолуние')).toBeInTheDocument();
      });

      const widget = screen.getByTitle('Нажмите для подробностей');
      fireEvent.click(widget);

      expect(mockNavigate).toHaveBeenCalledWith('/moon-calendar');
    });
  });

  describe('Error handling', () => {
    it('renders nothing when API fails', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const { container } = renderWithRouter(<MoonPhase />);

      await waitFor(() => {
        // Should finish loading
        expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
      });

      // Should render nothing (null)
      expect(container.querySelector('.moon-phase-widget')).not.toBeInTheDocument();
    });

    it('renders nothing when API returns unsuccessful response', async () => {
      axios.get.mockResolvedValue({
        data: {
          success: false,
        },
      });

      const { container } = renderWithRouter(<MoonPhase />);

      await waitFor(() => {
        expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
      });

      expect(container.querySelector('.moon-phase-widget')).not.toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('applies small size class', async () => {
      const { container } = renderWithRouter(<MoonPhase size="small" />);

      await waitFor(() => {
        expect(screen.getByText('🌕')).toBeInTheDocument();
      });

      expect(container.querySelector('.moon-phase-widget.small')).toBeInTheDocument();
    });

    it('applies medium size class', async () => {
      const { container } = renderWithRouter(<MoonPhase size="medium" />);

      await waitFor(() => {
        expect(screen.getByText('🌕')).toBeInTheDocument();
      });

      expect(container.querySelector('.moon-phase-widget.medium')).toBeInTheDocument();
    });

    it('applies detailed class when showDetails is true', async () => {
      const { container } = renderWithRouter(<MoonPhase showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText('Полнолуние')).toBeInTheDocument();
      });

      expect(container.querySelector('.moon-phase-widget.detailed')).toBeInTheDocument();
    });
  });

  describe('API integration', () => {
    it('calls correct API endpoint', async () => {
      renderWithRouter(<MoonPhase />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/moon/current')
        );
      });
    });
  });
});
