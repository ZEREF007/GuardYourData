import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggle: () => {} })
const THEME_KEY = 'theme'
const THEME_PREF_KEY = 'theme_preference_set'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const prefSet = localStorage.getItem(THEME_PREF_KEY) === '1'
    // Force white as first-load default unless user explicitly chose a theme.
    if (!prefSet) {
      localStorage.setItem(THEME_KEY, 'light')
      return false
    }
    const stored = localStorage.getItem(THEME_KEY)
    if (stored) return stored === 'dark'
    return false
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggle: () => {
        localStorage.setItem(THEME_PREF_KEY, '1')
        setIsDark((d) => !d)
      }
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
