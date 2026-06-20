import { useMemo, useState } from 'react'
import { useRecipes } from '../hooks/useRecipes'
import { RecipeCard } from '../components/RecipeCard'
import { SearchBar } from '../components/SearchBar'
import { FilterChips } from '../components/FilterChips'

export function HomePage() {
  const { data, loading, error } = useRecipes()
  const [query, setQuery] = useState('')
  const [types, setTypes] = useState<Set<string>>(new Set())
  const [origins, setOrigins] = useState<Set<string>>(new Set())

  // Options construites à partir des valeurs réellement présentes.
  const { typeOptions, originOptions } = useMemo(() => {
    const t = new Set<string>()
    const o = new Set<string>()
    for (const r of data ?? []) {
      if (r.type) t.add(r.type)
      if (r.origin) o.add(r.origin)
    }
    return {
      typeOptions: [...t].sort(),
      originOptions: [...o].sort(),
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

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void) => (
    value: string,
  ) => {
    const next = new Set(set)
    next.has(value) ? next.delete(value) : next.add(value)
    setter(next)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Le carnet
        </h1>
        <p className="text-muted">
          Choisis une recette, ajuste les portions, vois le coût en direct.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="space-y-4">
        <FilterChips
          label="Type"
          options={typeOptions}
          selected={types}
          onToggle={toggle(types, setTypes)}
        />
        <FilterChips
          label="Origine"
          options={originOptions}
          selected={origins}
          onToggle={toggle(origins, setOrigins)}
        />
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {filtered.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
