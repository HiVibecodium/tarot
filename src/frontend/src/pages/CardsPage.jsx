import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TarotCard from '../components/TarotCard'
import { CardGridSkeleton } from '../components/skeletons/LoadingSkeletons'
import { CardsSEO } from '../components/SEO'
import './CardsPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function CardsPage() {
  // Encyclopedia of all Tarot cards
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    try {
      const response = await axios.get(`${API_URL}/cards`)
      setCards(response.data.data || [])
    } catch (error) {
      console.error('Load cards error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (card) => {
    setSelectedCard(card)
  }

  const closeModal = () => {
    setSelectedCard(null)
  }

  return (
    <div className="cards-page">
      <CardsSEO />

      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Назад
        </button>
        <h1>🃏 Энциклопедия Карт Таро</h1>
      </header>

      <main className="cards-content">
        {loading && <CardGridSkeleton count={12} />}

        <div className="cards-grid">
          {cards.map((card) => (
            <div
              key={card._id}
              className="card-item"
              onClick={() => handleCardClick(card)}
            >
              <TarotCard
                card={{
                  ...card,
                  keywords: card.keywords?.upright || []
                }}
                reversed={false}
                showInterpretation={false}
              />
              <div className="card-name">{card.name}</div>
            </div>
          ))}
        </div>

        {cards.length === 0 && !loading && (
          <div className="empty-state">
            <p>Карты не найдены. Запустите seed скрипт.</p>
          </div>
        )}
      </main>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="card-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>

            <h2>{selectedCard.name}</h2>
            <p className="card-meta">
              {selectedCard.arcana === 'major' ? 'Старший' : 'Младший'} Аркан {selectedCard.number !== null && `• ${selectedCard.number}`}
            </p>

            <div className="interpretations-section">
              <h3>Прямое Значение:</h3>
              <div className="keywords">
                {selectedCard.keywords?.upright?.map((kw, idx) => (
                  <span key={idx} className="keyword">{kw}</span>
                ))}
              </div>

              <h3>Перевёрнутое Значение:</h3>
              <div className="keywords">
                {selectedCard.keywords?.reversed?.map((kw, idx) => (
                  <span key={idx} className="keyword reversed-kw">{kw}</span>
                ))}
              </div>
            </div>

            <button onClick={closeModal} className="btn-primary">
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CardsPage
