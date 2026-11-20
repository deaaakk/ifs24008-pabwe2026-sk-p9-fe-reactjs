import { useEffect, useState } from 'react'

export default function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [accent, setAccent] = useState(() => localStorage.getItem('accent') || '#2563eb')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    localStorage.setItem('accent', accent)
  }, [accent])
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, accent, setAccent, toggleTheme }
}
