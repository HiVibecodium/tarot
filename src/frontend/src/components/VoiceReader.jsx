import { useState } from 'react'
import './VoiceReader.css'

function VoiceReader({ text }) {
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [utterance, setUtterance] = useState(null)

  const handleRead = () => {
    if (!text) return

    if (isPaused && utterance) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsReading(true)
      return
    }

    const newUtterance = new SpeechSynthesisUtterance(text)
    newUtterance.lang = 'ru-RU'
    newUtterance.rate = 0.9
    newUtterance.pitch = 1.0

    newUtterance.onend = () => {
      setIsReading(false)
      setIsPaused(false)
    }

    setUtterance(newUtterance)
    window.speechSynthesis.speak(newUtterance)
    setIsReading(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    window.speechSynthesis.pause()
    setIsPaused(true)
    setIsReading(false)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setIsReading(false)
    setIsPaused(false)
  }

  const isSupported = 'speechSynthesis' in window

  if (!isSupported) {
    return null // Hide if browser doesn't support TTS
  }

  return (
    <div className="voice-reader">
      <div className="voice-controls">
        {!isReading && !isPaused && (
          <button onClick={handleRead} className="voice-btn voice-play" title="Прослушать">
            🔊 Прослушать
          </button>
        )}

        {isReading && (
          <button onClick={handlePause} className="voice-btn voice-pause" title="Пауза">
            ⏸ Пауза
          </button>
        )}

        {isPaused && (
          <button onClick={handleRead} className="voice-btn voice-resume" title="Продолжить">
            ▶️ Продолжить
          </button>
        )}

        {(isReading || isPaused) && (
          <button onClick={handleStop} className="voice-btn voice-stop" title="Остановить">
            ⏹ Стоп
          </button>
        )}
      </div>

      {isReading && (
        <div className="voice-indicator">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      )}
    </div>
  )
}

export default VoiceReader
