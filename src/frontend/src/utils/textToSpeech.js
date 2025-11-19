/**
 * Text-to-Speech Utility
 * Uses Browser Web Speech API for voice reading
 * Premium feature with offline support
 */

class TextToSpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.utterance = null;
    this.isPaused = false;
    this.isSupported = 'speechSynthesis' in window;
  }

  /**
   * Check if TTS is supported
   */
  isAvailable() {
    return this.isSupported;
  }

  /**
   * Get available voices
   */
  getVoices() {
    return this.synthesis.getVoices();
  }

  /**
   * Get Russian voices (preferred)
   */
  getRussianVoices() {
    const voices = this.getVoices();
    return voices.filter(voice =>
      voice.lang.startsWith('ru') ||
      voice.name.toLowerCase().includes('russian')
    );
  }

  /**
   * Speak text
   */
  speak(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Text-to-Speech not supported in this browser');
      return false;
    }

    // Stop any current speech
    this.stop();

    // Create new utterance
    this.utterance = new SpeechSynthesisUtterance(text);

    // Configure voice
    const russianVoices = this.getRussianVoices();
    if (russianVoices.length > 0) {
      this.utterance.voice = russianVoices[0];
    }

    // Configure settings
    this.utterance.lang = options.lang || 'ru-RU';
    this.utterance.rate = options.rate || 1.0; // 0.1 to 10
    this.utterance.pitch = options.pitch || 1.0; // 0 to 2
    this.utterance.volume = options.volume || 1.0; // 0 to 1

    // Event handlers
    if (options.onStart) {
      this.utterance.onstart = options.onStart;
    }

    if (options.onEnd) {
      this.utterance.onend = options.onEnd;
    }

    if (options.onError) {
      this.utterance.onerror = options.onError;
    }

    // Speak
    this.synthesis.speak(this.utterance);
    this.isPaused = false;

    return true;
  }

  /**
   * Pause speech
   */
  pause() {
    if (this.synthesis.speaking && !this.isPaused) {
      this.synthesis.pause();
      this.isPaused = true;
    }
  }

  /**
   * Resume speech
   */
  resume() {
    if (this.isPaused) {
      this.synthesis.resume();
      this.isPaused = false;
    }
  }

  /**
   * Stop speech
   */
  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.isPaused = false;
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking() {
    return this.synthesis.speaking;
  }

  /**
   * Format reading for speech
   */
  formatReadingForSpeech(reading) {
    let text = '';

    // Add card names
    if (reading.cards && reading.cards.length > 0) {
      const cardNames = reading.cards.map(c => c.name).join(', ');
      text += `Выпали карты: ${cardNames}. `;
    }

    // Add interpretation
    if (reading.interpretation) {
      text += reading.interpretation + ' ';
    }

    // Add advice if available
    if (reading.advice) {
      text += `Совет: ${reading.advice}`;
    }

    return text;
  }

  /**
   * Format card for speech
   */
  formatCardForSpeech(card) {
    let text = `Карта: ${card.name}. `;

    // Add keywords
    if (card.keywords?.upright) {
      text += `Ключевые слова: ${card.keywords.upright.join(', ')}. `;
    }

    // Add interpretation
    if (card.interpretations?.daily?.upright) {
      const interpretation = card.interpretations.daily.upright[0];
      text += interpretation;
    }

    return text;
  }
}

// Create singleton instance
const ttsService = new TextToSpeechService();

export default ttsService;
