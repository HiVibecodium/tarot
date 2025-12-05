import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

/**
 * Enhanced Theme Provider with System Preference Detection
 * - Detects OS dark mode preference
 * - Persists user choice in localStorage
 * - Listens for system theme changes
 * - Smooth transitions between themes
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Priority: localStorage > system preference > default light
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme
    }

    // Detect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }

    return 'light'
  })

  const [systemPreference, setSystemPreference] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Listen for system theme changes
  useEffect(() => {
    if (!window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      const newPreference = e.matches ? 'dark' : 'light'
      setSystemPreference(newPreference)

      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(newPreference)
      }
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document with smooth transition
    const root = document.documentElement

    // Add transition class temporarily
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease'

    // Apply theme
    root.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)

    // Remove transition after animation completes
    const timer = setTimeout(() => {
      root.style.transition = ''
    }, 300)

    return () => clearTimeout(timer)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const setLightTheme = () => setTheme('light')
  const setDarkTheme = () => setTheme('dark')

  const useSystemTheme = () => {
    localStorage.removeItem('theme')
    setTheme(systemPreference)
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      systemPreference,
      toggleTheme,
      setLightTheme,
      setDarkTheme,
      useSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
