import { useState } from 'react'
import './MoodSelector.css'

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Счастлив', color: '#FFD43B' },
  { id: 'calm', emoji: '😌', label: 'Спокоен', color: '#51CF66' },
  { id: 'anxious', emoji: '😰', label: 'Тревожен', color: '#FF6B6B' },
  { id: 'sad', emoji: '😢', label: 'Грустен', color: '#748FFC' },
  { id: 'excited', emoji: '🤩', label: 'Взволнован', color: '#FFD43B' },
  { id: 'confused', emoji: '😕', label: 'Растерян', color: '#E599F7' },
  { id: 'neutral', emoji: '😐', label: 'Нейтрально', color: '#ADB5BD' }
]

const ENERGY_LEVELS = [
  { value: 1, label: 'Очень низкая', emoji: '🪫' },
  { value: 2, label: 'Низкая', emoji: '🔋' },
  { value: 3, label: 'Средняя', emoji: '⚡' },
  { value: 4, label: 'Высокая', emoji: '✨' },
  { value: 5, label: 'Очень высокая', emoji: '🔥' }
]

const MOOD_TAGS = [
  'работа', 'отношения', 'деньги', 'здоровье',
  'семья', 'карьера', 'творчество', 'учёба'
]

function MoodSelector({
  value,
  onChange,
  label = 'Как вы себя чувствуете?',
  showEnergy = false,
  showTags = false,
  showNotes = false,
  onFullSubmit = null
}) {
  const [selectedMood, setSelectedMood] = useState(value || '')
  const [energy, setEnergy] = useState(3)
  const [tags, setTags] = useState([])
  const [notes, setNotes] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleMoodClick = (moodId) => {
    setSelectedMood(moodId)
    if (onChange && !showEnergy && !showTags && !showNotes) {
      onChange(moodId)
    }
  }

  const handleTagToggle = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag))
    } else {
      setTags([...tags, tag])
    }
  }

  const handleFullSubmit = () => {
    if (!selectedMood) {
      alert('Пожалуйста, выберите настроение')
      return
    }

    if (onFullSubmit) {
      onFullSubmit({
        mood: selectedMood,
        energy: showEnergy ? energy : undefined,
        tags: showTags ? tags : undefined,
        notes: showNotes ? notes : undefined
      })
    } else if (onChange) {
      onChange(selectedMood)
    }
  }

  const selectedMoodData = MOODS.find(m => m.id === selectedMood)

  return (
    <div className="mood-selector">
      <label className="mood-label">{label}</label>
      <div className="mood-grid">
        {MOODS.map(mood => (
          <button
            key={mood.id}
            type="button"
            className={`mood-btn ${selectedMood === mood.id ? 'selected' : ''}`}
            style={{
              borderColor: selectedMood === mood.id ? mood.color : '#ddd',
              backgroundColor: selectedMood === mood.id ? `${mood.color}20` : 'white'
            }}
            onClick={() => handleMoodClick(mood.id)}
            title={mood.label}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-text">{mood.label}</span>
          </button>
        ))}
      </div>

      {/* Energy Level */}
      {showEnergy && selectedMood && (
        <div className="energy-selector">
          <label className="energy-label">
            ⚡ Уровень энергии: {ENERGY_LEVELS[energy - 1]?.emoji} {ENERGY_LEVELS[energy - 1]?.label}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={energy}
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="energy-slider"
          />
          <div className="energy-scale">
            <span>🪫</span>
            <span>🔋</span>
            <span>⚡</span>
            <span>✨</span>
            <span>🔥</span>
          </div>
        </div>
      )}

      {/* Advanced Options Toggle */}
      {(showTags || showNotes) && selectedMood && (
        <button
          className="toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          type="button"
        >
          {showAdvanced ? '▼' : '▶'} Дополнительно (теги и заметки)
        </button>
      )}

      {/* Tags */}
      {showTags && showAdvanced && (
        <div className="mood-tags">
          <label className="tags-label">🏷️ Теги:</label>
          <div className="tag-options">
            {MOOD_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-option ${tags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {showNotes && showAdvanced && (
        <div className="mood-notes">
          <label className="notes-label">📝 Заметки:</label>
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Что происходит в вашей жизни сейчас?"
            rows="3"
          />
        </div>
      )}

      {/* Submit Button for Full Mode */}
      {onFullSubmit && selectedMood && (
        <button className="mood-submit" onClick={handleFullSubmit} type="button">
          Сохранить
        </button>
      )}
    </div>
  )
}

export default MoodSelector
