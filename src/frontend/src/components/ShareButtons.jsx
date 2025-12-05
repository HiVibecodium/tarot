import { useState } from 'react'
import { downloadReadingImage, shareReadingImage } from '../utils/shareImageGenerator'
import './ShareButtons.css'

function ShareButtons({ reading }) {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  const getShareText = () => {
    if (!reading) return ''

    let text = '🔮 Мой расклад Таро:\n\n'

    if (reading.type === 'daily') {
      const card = reading.cards[0]
      text += `Карта дня: ${card.cardName || card.name}\n`
      text += reading.interpretation?.text || ''
    } else if (reading.type === 'decision') {
      text += `Вопрос: ${reading.context?.question}\n\n`
      reading.cards.forEach((card) => {
        text += `${card.positionName}: ${card.cardName}\n`
      })
    }

    text += '\n\n🔮 Попробуй сам: https://tarot-assistant.com'
    return text
  }

  const getShareUrl = () => {
    return window.location.origin
  }

  const handleCopyLink = async () => {
    try {
      const text = getShareText()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleShareVK = () => {
    const url = getShareUrl()
    const text = getShareText()
    window.open(
      `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const handleShareTelegram = () => {
    const text = getShareText()
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(text)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const handleShareWhatsApp = () => {
    const text = getShareText()
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const handleShareImage = async () => {
    if (!reading) return

    setGenerating(true)
    try {
      await shareReadingImage(reading)
    } catch (error) {
      console.error('Share image failed:', error)
      alert('Ошибка при создании изображения')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadImage = async () => {
    if (!reading) return

    setGenerating(true)
    try {
      await downloadReadingImage(reading)
    } catch (error) {
      console.error('Download image failed:', error)
      alert('Ошибка при скачивании изображения')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="share-buttons">
      <div className="share-label">Поделиться:</div>

      <button
        onClick={handleShareImage}
        className="share-btn share-image"
        title="Поделиться картинкой"
        disabled={generating}
      >
        {generating ? '⏳ Создание...' : '🖼️ Картинка'}
      </button>

      <button onClick={handleCopyLink} className="share-btn share-copy" title="Копировать">
        {copied ? '✅ Скопировано!' : '📋 Копировать'}
      </button>

      <button onClick={handleShareVK} className="share-btn share-vk" title="ВКонтакте">
        VK
      </button>

      <button onClick={handleShareTelegram} className="share-btn share-telegram" title="Telegram">
        ✈️ Telegram
      </button>

      <button onClick={handleShareWhatsApp} className="share-btn share-whatsapp" title="WhatsApp">
        💬 WhatsApp
      </button>

      <button
        onClick={handleDownloadImage}
        className="share-btn share-download"
        title="Скачать картинку"
        disabled={generating}
      >
        💾 Скачать
      </button>
    </div>
  )
}

export default ShareButtons
