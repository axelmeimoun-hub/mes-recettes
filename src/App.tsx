import { Link, Outlet } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'

export function App() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="text-2xl">🍲</span>
            <span className="font-display text-xl font-semibold tracking-tight">
              Mes recettes
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-line py-8 text-center text-sm text-muted">
        Cuisiné maison · données Supabase
      </footer>
    </div>
  )
}
