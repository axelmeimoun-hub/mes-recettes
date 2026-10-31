import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { SearchBar } from '../components/SearchBar'
import { FilterDropdown } from '../components/FilterDropdown'
import { Check, ShoppingSheet } from '../components/ShoppingSheet'
import { buildShoppingList, type Selection } from '../lib/shopping'
import type { RecipeWithIngredients } from '../types/db'

const STORAGE_KEY = 'courses-selection'

// La sélection survit au rechargement (utile entre deux courses).
function loadSelection(): Selection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Selection) : {}
  } catch {
    return {}
  }
}

const clamp = (n: number) => Math.min(999, Math.max(1, n))

export function ShoppingListPage() {
  const { data, loading, error } = useRecipes()
  const [selection, setSelection] = useState<Selection>(loadSelection)
  const [query, setQuery] = useState('')
  const [types, setTypes] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selection))
    } catch {
      /* stockage indisponible : la sélection reste en mémoire */
    }
  }, [selection])

  const typeOptions = useMemo(
    () => [...new Set((data ?? []).map((r) => r.type).filter(Boolean))],
    [data],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter((r) => {
      if (q && !r.name.toLowerCase().includes(q)) return false
      if (types.size && !types.has(r.type)) return false
      return true
    })
  }, [data, query, types])

  // Ignore les recettes supprimées depuis la dernière visite.
  const activeSelection = useMemo(() => {
    const ids = new Set((data ?? []).map((r) => r.id))
    return Object.fromEntries(
      Object.entries(selection).filter(([id]) => ids.has(Number(id))),
    ) as Selection
  }, [data, selection])

  const recipeCount = Object.keys(activeSelection).length
  const itemCount = useMemo(
    () =>
      buildShoppingList(data ?? [], activeSelection, true).reduce(
        (n, [, items]) => n + items.length,
        0,
      ),
    [data, activeSelection],
  )

  const toggle = (r: RecipeWithIngredients) =>
    setSelection((s) => {
      const next = { ...s }
      if (next[r.id]) delete next[r.id]
      else next[r.id] = Math.max(1, r.base_portions)
      return next
    })

  const setPortions = (id: number, n: number) =>
    setSelection((s) => ({ ...s, [id]: clamp(n) }))

  const toggleType = (value: string) =>
    setTypes((s) => {
      const next = new Set(s)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-terracotta"
        >
          ← Mes recettes
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Liste de courses
        </h1>
        <p className="text-muted">
          Sélectionne tes recettes et indique combien de parts ou de personnes
          tu veux.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="flex flex-wrap gap-3">
        <FilterDropdown
          label="Type"
          options={typeOptions}
          selected={types}
          onToggle={toggleType}
          onClear={() => setTypes(new Set())}
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
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              {filtered.length} recette{filtered.length > 1 ? 's' : ''}
            </span>
            {recipeCount > 0 && (
              <button
                type="button"
                onClick={() => setSelection({})}
                className="underline underline-offset-4 hover:text-terracotta"
              >
                Tout désélectionner
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted">
              Aucune recette ne correspond.
            </p>
          ) : (
            <ul className="grid gap-2.5 md:grid-cols-2">
              {filtered.map((r) => (
                <RecipeRow
                  key={r.id}
                  recipe={r}
                  portions={activeSelection[r.id]}
                  onToggle={() => toggle(r)}
                  onPortions={(n) => setPortions(r.id, n)}
                />
              ))}
            </ul>
          )}
        </>
      )}

      {/* Barre d'export */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream/90 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div>
            <p className="font-display text-base font-semibold">
              {recipeCount
                ? `${recipeCount} recette${recipeCount > 1 ? 's' : ''} sélectionnée${recipeCount > 1 ? 's' : ''}`
                : 'Aucune recette'}
            </p>
            <p className="text-xs text-muted">
              {recipeCount
                ? `${itemCount} ingrédient${itemCount > 1 ? 's' : ''} à acheter`
                : 'Sélectionne au moins une recette'}
            </p>
          </div>
          <button
            type="button"
            disabled={!recipeCount}
            onClick={() => setOpen(true)}
            className="rounded-full border border-terracotta bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Exporter la liste de courses
          </button>
        </div>
      </div>

      {open && (
        <ShoppingSheet
          recipes={data ?? []}
          selection={activeSelection}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

interface RowProps {
  recipe: RecipeWithIngredients
  portions: number | undefined
  onToggle: () => void
  onPortions: (n: number) => void
}

function RecipeRow({ recipe, portions, onToggle, onPortions }: RowProps) {
  const on = portions !== undefined
  const label =
    portions === 1 ? recipe.portion_label.replace(/s$/, '') : recipe.portion_label

  return (
    <li
      className={[
        'flex items-center gap-3 rounded-xl2 border p-2.5 transition-colors',
        on ? 'border-terracotta bg-terracotta/5' : 'border-line bg-surface',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={on}
        aria-label={`${on ? 'Retirer' : 'Ajouter'} ${recipe.name}`}
        className="flex shrink-0 items-center gap-3"
      >
        <Check on={on} />
        <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-line text-xl">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="opacity-40">🍽️</span>
          )}
        </span>
      </button>

      <div className="min-w-0 flex-1 space-y-1.5">
        <button
          type="button"
          onClick={onToggle}
          className="block text-left font-display text-base font-semibold leading-snug"
        >
          {recipe.name}
        </button>
        {on ? (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-full border border-line bg-surface">
              <button
                type="button"
                aria-label="Diminuer"
                disabled={portions <= 1}
                onClick={() => onPortions(portions - 1)}
                className="grid h-9 w-9 place-items-center rounded-full text-xl leading-none transition-colors hover:text-terracotta disabled:opacity-30"
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={999}
                value={portions}
                aria-label={`Nombre de ${recipe.portion_label}`}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10)
                  if (!Number.isNaN(n)) onPortions(n)
                }}
                className="tabular w-11 border-x border-line bg-transparent py-1 text-center text-base font-semibold focus:outline-none"
              />
              <button
                type="button"
                aria-label="Augmenter"
                onClick={() => onPortions(portions + 1)}
                className="grid h-9 w-9 place-items-center rounded-full text-xl leading-none transition-colors hover:text-terracotta"
              >
                +
              </button>
            </div>
            <span className="text-sm text-muted">{label}</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-terracotta/15 px-2.5 py-0.5 text-xs text-terracotta">
              {recipe.type}
            </span>
            <span className="rounded-full bg-olive/15 px-2.5 py-0.5 text-xs text-olive">
              {recipe.origin}
            </span>
          </div>
        )}
      </div>
    </li>
  )
}
