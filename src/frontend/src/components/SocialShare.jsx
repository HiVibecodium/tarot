/**
 * Social Share Component
 * Share readings on social media
 */

import { useState } from 'prop-types';
import PropTypes from 'prop-types';
import './SocialShare.css';

const SocialShare = ({ reading, onClose }) => {
  const [shareUrl, setShareUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const createShareLink = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/social/share/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          readingId: reading.id,
          privacy: 'public'
        })
      });

      const data = await response.json();

      if (data.success) {
        setShareUrl(data.share.url);
      }
    } catch (error) {
      console.error('Error creating share link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToTwitter = () => {
    const text = `Получил расклад Таро: ${reading.cards[0]?.name} 🔮`;
    const url = shareUrl || window.location.href;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const shareToVK = () => {
    const url = shareUrl || window.location.href;

    window.open(
      `https://vk.com/share.php?url=${encodeURIComponent(url)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const shareToTelegram = () => {
    const text = `Получил расклад Таро: ${reading.cards[0]?.name} 🔮`;
    const url = shareUrl || window.location.href;

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const shareToWhatsApp = () => {
    const text = `Получил расклад Таро: ${reading.cards[0]?.name} 🔮\n${shareUrl || window.location.href}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  return (
    <div className="social-share">
      <div className="social-share-overlay" onClick={onClose}></div>

      <div className="social-share-content">
        <button className="social-share-close" onClick={onClose}>&times;</button>

        <h2>Поделиться раскладом</h2>

        {!shareUrl ? (
          <div className="share-create">
            <p>Создайте ссылку для sharing</p>
            <button
              className="btn-primary"
              onClick={createShareLink}
              disabled={loading}
            >
              {loading ? 'Создание...' : 'Создать ссылку'}
            </button>
          </div>
        ) : (
          <>
            <div className="share-link">
              <input
                type="text"
                value={shareUrl}
                readOnly
                onClick={(e) => e.target.select()}
              />
              <button
                className="btn-copy"
                onClick={copyToClipboard}
              >
                {copied ? '✓ Скопировано' : 'Копировать'}
              </button>
            </div>

            <div className="share-buttons">
              <button
                className="share-btn share-twitter"
                onClick={shareToTwitter}
                aria-label="Поделиться в Twitter"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
                Twitter
              </button>

              <button
                className="share-btn share-vk"
                onClick={shareToVK}
                aria-label="Поделиться ВКонтакте"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.25 14.48h-1.62c-.74 0-.96-.6-2.29-1.94-1.15-1.12-1.66-1.27-1.95-1.27-.4 0-.51.1-.51.62v1.76c0 .48-.15.77-1.43.77-2.37 0-5-1.44-6.85-4.12-2.77-3.97-3.53-6.95-3.53-7.56 0-.29.1-.56.62-.56h1.63c.46 0 .63.21.81.7.94 2.74 2.52 5.15 3.17 5.15.25 0 .36-.11.36-.73V8.45c-.1-1.15-.67-1.25-.67-1.65 0-.24.19-.48.5-.48h2.55c.38 0 .52.2.52.65v3.52c0 .38.17.52.28.52.25 0 .46-.14.92-.6 1.4-1.58 2.4-4.03 2.4-4.03.13-.29.34-.56.8-.56h1.62c.55 0 .67.28.55.65-.19.92-2.28 4.1-2.28 4.1-.21.34-.29.5 0 .88.21.28.89.87 1.35 1.4.82.94 1.46 1.72 1.63 2.27.17.54-.1.82-.64.82z"/>
                </svg>
                ВКонтакте
              </button>

              <button
                className="share-btn share-telegram"
                onClick={shareToTelegram}
                aria-label="Поделиться в Telegram"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Telegram
              </button>

              <button
                className="share-btn share-whatsapp"
                onClick={shareToWhatsApp}
                aria-label="Поделиться в WhatsApp"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

SocialShare.propTypes = {
  reading: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    cards: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    )
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default SocialShare;
