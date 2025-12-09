import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TarotCard from '../TarotCard';

// Mock the utility functions
jest.mock('../../utils/cardVisuals', () => ({
  getCardVisual: jest.fn(() => ({
    emoji: '🔮',
    gradient: ['#1a1a2e', '#16213e']
  }))
}));

jest.mock('../../utils/cardImages', () => ({
  getCardImagePath: jest.fn(() => '/images/cards/fool.jpg'),
  getFallbackImagePath: jest.fn(() => '/images/cards/card-back.jpg')
}));

const mockCard = {
  _id: 'the-fool',
  name: 'The Fool',
  cardName: 'Шут',
  suit: null,
  keywords: ['Начало', 'Свобода', 'Приключение'],
  interpretation: 'Карта новых начинаний и безграничных возможностей.'
};

const mockMinorCard = {
  _id: 'ace-of-wands',
  name: 'Ace of Wands',
  cardName: 'Туз Жезлов',
  suit: 'wands',
  keywords: ['Вдохновение', 'Энергия', 'Творчество'],
  interpretation: 'Новое начинание с большой энергией.'
};

describe('TarotCard Component', () => {
  describe('Rendering', () => {
    it('renders card with name', () => {
      render(<TarotCard card={mockCard} />);
      expect(screen.getByText('Шут')).toBeInTheDocument();
    });

    it('renders placeholder when no card provided', () => {
      render(<TarotCard card={null} />);
      expect(screen.getByText('🔮')).toBeInTheDocument();
    });

    it('renders keywords', () => {
      render(<TarotCard card={mockCard} />);
      expect(screen.getByText('Начало')).toBeInTheDocument();
      expect(screen.getByText('Свобода')).toBeInTheDocument();
      expect(screen.getByText('Приключение')).toBeInTheDocument();
    });

    it('renders interpretation when showInterpretation is true', () => {
      render(<TarotCard card={mockCard} showInterpretation={true} />);
      expect(screen.getByText(/безграничных возможностей/)).toBeInTheDocument();
    });

    it('hides interpretation when showInterpretation is false', () => {
      render(<TarotCard card={mockCard} showInterpretation={false} />);
      expect(screen.queryByText(/безграничных возможностей/)).not.toBeInTheDocument();
    });

    it('shows reversed indicator when reversed is true', () => {
      render(<TarotCard card={mockCard} reversed={true} />);
      expect(screen.getByText('↓ Reversed')).toBeInTheDocument();
    });

    it('does not show reversed indicator when reversed is false', () => {
      render(<TarotCard card={mockCard} reversed={false} />);
      expect(screen.queryByText('↓ Reversed')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has correct role attribute', () => {
      render(<TarotCard card={mockCard} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
      render(<TarotCard card={mockCard} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', expect.stringContaining('Шут'));
    });

    it('has correct aria-label when reversed', () => {
      render(<TarotCard card={mockCard} reversed={true} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', expect.stringContaining('reversed'));
    });

    it('is focusable with tabIndex', () => {
      render(<TarotCard card={mockCard} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Interactions', () => {
    it('flips card on click', async () => {
      const user = userEvent.setup();
      render(<TarotCard card={mockCard} />);

      const container = screen.getByRole('button').parentElement;
      expect(container).not.toHaveClass('flipped');

      await user.click(screen.getByRole('button'));
      expect(container).toHaveClass('flipped');
    });

    it('flips card on Enter key', () => {
      render(<TarotCard card={mockCard} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: 'Enter' });
      expect(button.parentElement).toHaveClass('flipped');
    });

    it('flips card on Space key', () => {
      render(<TarotCard card={mockCard} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: ' ' });
      expect(button.parentElement).toHaveClass('flipped');
    });

    it('toggles flip state on multiple clicks', async () => {
      const user = userEvent.setup();
      render(<TarotCard card={mockCard} />);

      const button = screen.getByRole('button');
      const container = button.parentElement;

      await user.click(button);
      expect(container).toHaveClass('flipped');

      await user.click(button);
      expect(container).not.toHaveClass('flipped');
    });
  });

  describe('Card Suits', () => {
    it('renders wands suit correctly', () => {
      render(<TarotCard card={mockMinorCard} />);
      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveAttribute('data-suit', 'wands');
    });

    it('renders major arcana correctly', () => {
      render(<TarotCard card={mockCard} />);
      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveAttribute('data-suit', 'major');
    });
  });

  describe('Image Handling', () => {
    it('renders card image', () => {
      render(<TarotCard card={mockCard} />);
      const img = screen.getByAltText('Шут');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('shows loading state initially', () => {
      render(<TarotCard card={mockCard} />);
      const img = screen.getByAltText('Шут');
      expect(img).toHaveClass('loading');
    });
  });
});
