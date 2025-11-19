/**
 * Sound Effects using Web Audio API
 * Generates procedural sounds without external audio files
 */

let audioContext = null
let isMuted = false

// Initialize audio context
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Play a tone
const playTone = (frequency, duration, type = 'sine', volume = 0.3) => {
  if (isMuted) return

  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.value = frequency
  oscillator.type = type

  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

/**
 * Card draw sound - magical chime
 */
export const playCardDrawSound = () => {
  if (isMuted) return

  const ctx = getAudioContext()
  const now = ctx.currentTime

  // Magic chime sequence
  playTone(523.25, 0.1, 'sine', 0.2) // C5
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.15), 50) // E5
  setTimeout(() => playTone(783.99, 0.15, 'sine', 0.1), 100) // G5
}

/**
 * Card reveal sound - triumphant
 */
export const playCardRevealSound = () => {
  if (isMuted) return

  const ctx = getAudioContext()
  const now = ctx.currentTime

  // Triumphant reveal
  playTone(440, 0.08, 'triangle', 0.15) // A4
  setTimeout(() => playTone(554.37, 0.08, 'triangle', 0.15), 60) // C#5
  setTimeout(() => playTone(659.25, 0.2, 'triangle', 0.12), 120) // E5
}

/**
 * Spread complete sound - success
 */
export const playSpreadCompleteSound = () => {
  if (isMuted) return

  const ctx = getAudioContext()

  // Success jingle
  playTone(523.25, 0.1, 'sine', 0.2) // C5
  setTimeout(() => playTone(659.25, 0.1, 'sine', 0.18), 100) // E5
  setTimeout(() => playTone(783.99, 0.1, 'sine', 0.16), 200) // G5
  setTimeout(() => playTone(1046.50, 0.25, 'sine', 0.14), 300) // C6
}

/**
 * Button click sound - subtle
 */
export const playClickSound = () => {
  if (isMuted) return
  playTone(800, 0.05, 'square', 0.1)
}

/**
 * Toggle mute
 */
export const toggleMute = () => {
  isMuted = !isMuted
  return isMuted
}

/**
 * Get mute status
 */
export const isSoundMuted = () => isMuted

/**
 * Set mute status
 */
export const setMute = (mute) => {
  isMuted = mute
}
