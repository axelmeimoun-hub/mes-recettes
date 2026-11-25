import { useEffect, useMemo, useState } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import { RecipeCard } from '../components/RecipeCard'
import { SearchBar } from '../components/SearchBar'
import { FilterDropdown } from '../components/FilterDropdown'

// Ordre d'affichage souhaité pour les types (les autres suivent en alphabétique).
const TYPE_ORDER = [
  'entrée',
  'plat',
  'dessert',
  'sauce',
  'apéritif',
  'cocktail',
  'boisson',
]

function byTypeOrder(a: string, b: string): number {
  const ia = TYPE_ORDER.indexOf(a)
  const ib = TYPE_ORDER.indexOf(b)
  if (ia === -1 && ib === -1) return a.localeCompare(b, 'fr')
  if (ia === -1) return 1
  if (ib === -1) return -1
  return ia - ib
}

const GROUP_LABELS: Record<string, string> = {
  entrée: 'Entrées',
  plat: 'Plats',
  dessert: 'Desserts',
  sauce: 'Sauces',
  apéritif: 'Apéritifs',
  cocktail: 'Cocktails',
  boisson: 'Boissons',
}

function groupLabel(type: string): string {
  return GROUP_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

const GROUP_KEY = 'group-by-type'

function loadGrouped(): boolean {
  try {
    return localStorage.getItem(GROUP_KEY) === '1'
  } catch {
    return false
  }
}

export function HomePage() {
  const { data, loading, error } = useRecipes()
  const [query, setQuery] = useState('')
  const [types, setTypes] = useState<Set<string>>(new Set())
  const [origins, setOrigins] = useState<Set<string>>(new Set())
  const [grouped, setGrouped] = useState(loadGrouped)

  useEffect(() => {
    try {
      localStorage.setItem(GROUP_KEY, grouped ? '1' : '0')
    } catch {
      /* stockage indisponible : le choix reste en mémoire */
    }
  }, [grouped])

  // Options construites à partir des valeurs réellement présentes.
  const { typeOptions, originOptions } = useMemo(() => {
    const t = new Set<string>()
    const o = new Set<string>()
    for (const r of data ?? []) {
      if (r.type) t.add(r.type)
      if (r.origin) o.add(r.origin)
    }
    return {
      typeOptions: [...t].sort(byTypeOrder),
      originOptions: [...o].sort((a, b) => a.localeCompare(b, 'fr')),
    }
  }, [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter((r) => {
      if (q && !r.name.toLowerCase().includes(q)) return false
      if (types.size && !types.has(r.type)) return false
      if (origins.size && !origins.has(r.origin)) return false
      return true
    })
  }, [data, query, types, origins])

  // Blocs par type, dans l'ordre entrée → plat → dessert (les autres suivent).
  const groups = useMemo(() => {
    const byType = new Map<string, typeof filtered>()
    for (const r of filtered) byType.set(r.type, [...(byType.get(r.type) ?? []), r])
    return [...byType.entries()].sort(([a], [b]) => byTypeOrder(a, b))
  }, [filtered])

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void) => (
    value: string,
  ) => {
    const next = new Set(set)
    next.has(value) ? next.delete(value) : next.add(value)
    setter(next)
  }

  return (
    <div className="space-y-6">
      <SearchBar value={query} onChange={setQuery} />

      <div className="flex flex-wrap gap-3">
        <FilterDropdown
          label="Type"
          options={typeOptions}
          selected={types}
          onToggle={toggle(types, setTypes)}
          onClear={() => setTypes(new Set())}
        />
        <FilterDropdown
          label="Influence"
          options={originOptions}
          selected={origins}
          onToggle={toggle(origins, setOrigins)}
          onClear={() => setOrigins(new Set())}
        />
        <button
          type="button"
          role="switch"
          aria-checked={grouped}
          onClick={() => setGrouped((g) => !g)}
          className="flex w-full items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30 sm:w-auto"
        >
          <span
            className={[
              'relative h-[1.4rem] w-[2.4rem] shrink-0 rounded-full transition-colors',
              grouped ? 'bg-terracotta' : 'bg-line',
            ].join(' ')}
          >
            <span
              className={[
                'absolute left-[0.15rem] top-[0.15rem] h-[1.1rem] w-[1.1rem] rounded-full bg-surface shadow transition-transform',
                grouped ? 'translate-x-4' : '',
              ].join(' ')}
            />
          </span>
          Regrouper par type
        </button>
      </div>

      {loading && <p className="py-12 text-center text-muted">Chargement…</p>}

      {error && (
        <p className="rounded-xl2 border border-terracotta/40 bg-terracotta/10 p-4 text-terracotta">
          Erreur de chargement : {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-muted">
            {filtered.length} recette{filtered.length > 1 ? 's' : ''}
          </p>
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted">
              Aucune recette ne correspond.
            </p>
          ) : (
            grouped ? (
              <div className="space-y-14">
                {groups.map(([type, items]) => (
                  <section key={type} aria-label={groupLabel(type)}>
                    <h2 className="sticky top-[4.3rem] z-10 -mx-4 mb-3 flex items-baseline gap-2 bg-cream/90 px-4 py-2 font-display text-2xl font-semibold backdrop-blur sm:-mx-6 sm:px-6">
                      {groupLabel(type)}
                      <span className="font-sans text-sm font-normal text-muted">
                        {items.length}
                      </span>
                    </h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                      {items.map((r) => (
                        <RecipeCard key={r.id} recipe={r} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                {filtered.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}
