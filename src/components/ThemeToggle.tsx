import { useEffect, useState } from 'react'

/** Bascule clair / sombre, persistée dans localStorage. */
export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-xl transition-colors hover:border-terracotta"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
