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
          <div className="flex items-center gap-2">
            <Link
              to="/courses"
              aria-label="Liste de courses"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold transition-colors [@media(hover:hover)]:hover:border-terracotta"
            >
              🛒
              <span className="hidden min-[520px]:inline">Liste de courses</span>
              <span className="min-[520px]:hidden">Courses</span>
            </Link>
            <ThemeToggle />
          </div>
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
