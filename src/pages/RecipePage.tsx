import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecipe } from '../hooks/useRecipe'
import { PortionSelector } from '../components/PortionSelector'
import { IngredientRow } from '../components/IngredientRow'
import { CostSummary } from '../components/CostSummary'
import { PrepSteps } from '../components/PrepSteps'
import { costPerPortion, splitSteps, totalCost } from '../lib/format'

export function RecipePage() {
  const { id } = useParams()
  const recipeId = id ? parseInt(id, 10) : null
  const { data, loading, error } = useRecipe(recipeId)

  const [portions, setPortions] = useState(1)
  const [includeOptional, setIncludeOptional] = useState(true)

  // Initialise le sélecteur sur base_portions une fois la recette chargée.
  useEffect(() => {
    if (data) setPortions(data.base_portions || 1)
  }, [data])

  const lines = useMemo(
    () =>
      [...(data?.recipe_ingredients ?? [])].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      ),
    [data],
  )

  const total = useMemo(
    () => totalCost(lines, portions, includeOptional),
    [lines, portions, includeOptional],
  )
  const perPortion = useMemo(
    () => costPerPortion(lines, portions, includeOptional),
    [lines, portions, includeOptional],
  )

  // Regroupe les ingrédients par type. Les groupes sont ordonnés selon leur
  // première apparition (= le plus petit sort_order), les lignes restent triées.
  const groups = useMemo(() => {
    const map = new Map<string, typeof lines>()
    for (const line of lines) {
      const key = line.ingredients?.type ?? 'Autres'
      const arr = map.get(key)
      if (arr) arr.push(line)
      else map.set(key, [line])
    }
    return [...map.entries()].map(([type, items]) => ({ type, items }))
  }, [lines])

  const steps = useMemo(() => splitSteps(data?.prep_steps ?? null), [data])
  const hasOptional = lines.some((l) => l.optional)

  if (loading) return <p className="py-12 text-center text-muted">Chargement…</p>
  if (error || !data)
    return (
      <div className="py-12 text-center">
        <p className="text-terracotta">Recette introuvable.</p>
        <Link to="/" className="mt-3 inline-block text-muted underline">
          ← Retour au carnet
        </Link>
      </div>
    )

  return (
    <article className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-terracotta"
      >
        ← Le carnet
      </Link>

      {/* En-tête */}
      <header className="space-y-4">
        {data.image_url && (
          <div className="aspect-[16/9] overflow-hidden rounded-xl2 border border-line bg-line">
            <img
              src={data.image_url}
              alt={data.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {data.name}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            <Tag>{data.type}</Tag>
            <Tag muted>{data.origin}</Tag>
            {data.category && <Tag muted>{data.category}</Tag>}
          </div>
          {data.source_url && (
            <a
              href={data.source_url}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm text-terracotta underline"
            >
              Voir la recette d'origine ↗
            </a>
          )}
        </div>
      </header>

      {/* Portions + coûts */}
      <section className="space-y-4 rounded-xl2 border border-line bg-surface p-4 sm:p-5">
        <PortionSelector
          value={portions}
          label={data.portion_label}
          onChange={setPortions}
        />
        <CostSummary
          total={total}
          perPortion={perPortion}
          portionLabel={data.portion_label}
        />
      </section>

      {/* Ingrédients */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">Ingrédients</h2>
          {hasOptional && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={includeOptional}
                onChange={(e) => setIncludeOptional(e.target.checked)}
                className="h-4 w-4 accent-terracotta"
              />
              Inclure les facultatifs
            </label>
          )}
        </div>
        <div className="space-y-5">
          {groups.map((group) => (
            <div key={group.type}>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                {group.type}
              </h3>
              <ul className="divide-y divide-line">
                {group.items.map((line) => (
                  <IngredientRow
                    key={line.id}
                    line={line}
                    portions={portions}
                    dimmed={line.optional && !includeOptional}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Préparation */}
      {steps.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Préparation</h2>
          <PrepSteps steps={steps} />
        </section>
      )}
    </article>
  )
}

function Tag({
  children,
  muted,
}: {
  children: React.ReactNode
  muted?: boolean
}) {
  return (
    <span
      className={[
        'rounded-full px-3 py-1 text-sm capitalize',
        muted ? 'bg-olive/15 text-olive' : 'bg-terracotta/15 text-terracotta',
      ].join(' ')}
    >
      {children}
    </span>
  )
}
