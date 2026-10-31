import { useEffect, useMemo, useState } from 'react'
import type { RecipeWithIngredients } from '../types/db'
import {
  buildShoppingList,
  formatShopQty,
  shoppingText,
  type Selection,
} from '../lib/shopping'
import { typeIcon } from '../lib/typeIcons'

interface Props {
  recipes: RecipeWithIngredients[]
  selection: Selection
  onClose: () => void
}

/** Panneau d'export : liste regroupée par type, à copier vers Google Keep. */
export function ShoppingSheet({ recipes, selection, onClose }: Props) {
  const [withOptional, setWithOptional] = useState(true)
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<string | null>(null)

  const groups = useMemo(
    () => buildShoppingList(recipes, selection, withOptional),
    [recipes, selection, withOptional],
  )
  const count = groups.reduce(
    (n, [, items]) => n + items.filter((i) => !skipped.has(i.key)).length,
    0,
  )
  const recipeCount = Object.keys(selection).length
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  // Échap ferme ; le fond ne défile plus tant que le panneau est ouvert.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const toggle = (key: string) =>
    setSkipped((s) => {
      const next = new Set(s)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const copy = async () => {
    const text = shoppingText(groups, skipped)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text })
      document.body.append(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setToast('Liste copiée — colle-la dans une liste Keep')
  }

  const share = () =>
    navigator
      .share({ title: 'Liste de courses', text: shoppingText(groups, skipped) })
      .catch(() => {})

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/55" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Liste de courses"
        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-3xl border border-b-0 border-line bg-cream shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[86dvh] md:w-[36rem] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border-b"
      >
        <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-5">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              Ta liste de courses
            </h2>
            <p className="mt-1 text-xs text-muted">
              {recipeCount} recette{recipeCount > 1 ? 's' : ''} · {count}{' '}
              ingrédient{count > 1 ? 's' : ''} · décoche ce que tu as déjà
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-surface text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 pb-4">
          <button
            type="button"
            role="switch"
            aria-checked={withOptional}
            onClick={() => setWithOptional((v) => !v)}
            className="flex items-center gap-2.5 text-sm"
          >
            <span
              className={[
                'relative h-[1.4rem] w-[2.4rem] rounded-full transition-colors',
                withOptional ? 'bg-terracotta' : 'bg-line',
              ].join(' ')}
            >
              <span
                className={[
                  'absolute left-[0.15rem] top-[0.15rem] h-[1.1rem] w-[1.1rem] rounded-full bg-surface shadow transition-transform',
                  withOptional ? 'translate-x-4' : '',
                ].join(' ')}
              />
            </span>
            Inclure les ingrédients facultatifs
          </button>

          {groups.map(([type, items]) => (
            <div key={type}>
              <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <span className="text-base">{typeIcon(type)}</span>
                {type}
                <span className="ml-auto font-medium normal-case tracking-normal">
                  {items.length}
                </span>
              </h3>
              <ul className="space-y-1.5">
                {items.map((item) => {
                  const on = !skipped.has(item.key)
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(item.key)}
                        className={[
                          'flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-2.5 text-left',
                          on ? '' : 'opacity-50',
                        ].join(' ')}
                      >
                        <Check on={on} />
                        <span
                          className={[
                            'min-w-0 flex-1 text-[0.95rem]',
                            on ? '' : 'line-through',
                          ].join(' ')}
                        >
                          {item.name}
                          {item.optionalOnly && (
                            <span className="ml-1.5 rounded-full bg-olive/15 px-1.5 py-0.5 text-[0.65rem] font-semibold text-olive no-underline">
                              facultatif
                            </span>
                          )}
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {item.from.join(' · ')}
                          </span>
                        </span>
                        <span className="tabular whitespace-nowrap text-sm font-semibold">
                          {formatShopQty(item)}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-2.5 rounded-b-3xl border-t border-line bg-cream px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copy}
              className="flex-1 basis-36 rounded-full border border-terracotta bg-terracotta px-4 py-2.5 text-sm font-semibold text-cream hover:opacity-90"
            >
              📋 Copier pour Google Keep
            </button>
            {canShare && (
              <button
                type="button"
                onClick={share}
                className="flex-1 basis-28 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold"
              >
                ↗ Partager
              </button>
            )}
            <a
              href="https://keep.google.com/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 basis-28 rounded-full border border-line bg-surface px-4 py-2.5 text-center text-sm font-semibold"
            >
              Ouvrir Keep
            </a>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Dans Keep, crée une liste puis colle : chaque ligne devient une tâche
            à cocher.
          </p>
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-28 left-1/2 z-[60] max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 text-center text-sm font-medium text-cream">
          {toast}
        </div>
      )}
    </>
  )
}

export function Check({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        'grid h-6 w-6 shrink-0 place-items-center rounded-md border-[1.5px] text-sm font-bold transition-colors',
        on
          ? 'border-terracotta bg-terracotta text-cream'
          : 'border-line bg-cream text-transparent',
      ].join(' ')}
    >
      ✓
    </span>
  )
}
