import PropTypes from 'prop-types'
import './SpreadModal.css'

/**
 * Modal for viewing saved spread readings from history
 */
function SpreadModal({ reading, onClose }) {
  if (!reading) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="spread-modal-backdrop" onClick={handleBackdropClick}>
      <div className="spread-modal">
        <div className="modal-header">
          <h2>{reading.spreadName || 'Расклад Таро'}</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="modal-body">
          {/* Question/Context */}
          {reading.question && (
            <div className="modal-question">
              <strong>Вопрос:</strong> {reading.question}
            </div>
          )}

          {reading.context?.partner && (
            <div className="modal-context">
              <strong>Партнёр:</strong> {reading.context.partner}
            </div>
          )}

          {reading.context?.careerGoal && (
            <div className="modal-context">
              <strong>Цель:</strong> {reading.context.careerGoal}
            </div>
          )}

          {reading.context?.yearGoal && (
            <div className="modal-context">
              <strong>Цель на год:</strong> {reading.context.yearGoal}
            </div>
          )}

          {/* Date */}
          <div className="modal-date">
            📅 {new Date(reading.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Summary */}
          {reading.interpretation?.summary && (
            <div className="modal-summary">
              <h3>Общее Значение</h3>
              <p>{reading.interpretation.summary}</p>
            </div>
          )}

          {/* Cards */}
          <div className="modal-cards">
            <h3>Вытянутые Карты ({reading.cards.length})</h3>
            <div className="modal-cards-grid">
              {reading.cards.map((card, idx) => (
                <div key={idx} className="modal-card">
                  <div className="modal-card-header">
                    <span className="card-position">#{idx + 1}</span>
                    {card.reversed && <span className="reversed-tag">⚡ Перевёрнута</span>}
                  </div>
                  <div className="modal-card-name">{card.cardName || card.name}</div>
                  {card.positionName && (
                    <div className="modal-card-position">{card.positionName}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interpretation text for simple readings */}
          {reading.interpretation?.text && (
            <div className="modal-interpretation">
              <h3>Интерпретация</h3>
              <p>{reading.interpretation.text}</p>
            </div>
          )}

          {/* Positions for spread readings */}
          {reading.interpretation?.positions && (
            <div className="modal-positions">
              <h3>Позиции Расклада</h3>
              {reading.interpretation.positions.map((pos, idx) => (
                <div key={idx} className="modal-position-item">
                  <div className="position-title">
                    <span className="position-num">{idx + 1}</span>
                    <strong>{pos.positionName}</strong>
                  </div>
                  <div className="position-card-name">{pos.card?.name || pos.card}</div>
                  <p className="position-meaning">{pos.interpretation || pos.meaning}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-primary">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

SpreadModal.propTypes = {
  reading: PropTypes.object,
  onClose: PropTypes.func.isRequired
}

export default SpreadModal
