import { useEffect, useRef, useState } from 'react'

interface Props {
  label: string
  options: string[]
  selected: Set<string>
  onToggle: (value: string) => void
  onClear: () => void
}

/** Liste déroulante multi-sélection construite à partir de valeurs réelles. */
export function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Ferme au clic extérieur et sur Échap.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // iOS/Android ne retirent pas le focus d'un bouton au tap sur une zone neutre.
        btnRef.current?.blur()
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (options.length === 0) return null
  const count = selected.size

  return (
    <div ref={ref} className="relative min-w-0 flex-1 sm:flex-none">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          // Une fois fermé, le bouton ne doit pas rester « actif » (focus / survol collant au tactile).
          if (open) e.currentTarget.blur()
          setOpen((o) => !o)
        }}
        className={[
          'flex w-full items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/30 sm:min-w-[11rem]',
          count
            ? 'border-terracotta bg-terracotta/10 text-ink'
            : 'border-line bg-surface text-ink [@media(hover:hover)]:hover:border-terracotta',
        ].join(' ')}
      >
        <span className="truncate">
          {label}
          {count > 0 && (
            <span className="ml-1.5 rounded-full bg-terracotta px-2 py-0.5 text-xs text-cream">
              {count}
            </span>
          )}
        </span>
        <span aria-hidden className={open ? 'rotate-180' : ''}>
          ▾
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 z-20 mt-2 w-full min-w-[14rem] overflow-hidden rounded-xl2 border border-line bg-surface shadow-lg"
        >
          <ul className="max-h-72 overflow-y-auto py-1">
            {options.map((opt) => {
              const active = selected.has(opt)
              return (
                <li key={opt}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => onToggle(opt)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm capitalize hover:bg-terracotta/10"
                  >
                    <span
                      aria-hidden
                      className={[
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] leading-none',
                        active
                          ? 'border-terracotta bg-terracotta text-cream'
                          : 'border-line',
                      ].join(' ')}
                    >
                      {active ? '✓' : ''}
                    </span>
                    {opt}
                  </button>
                </li>
              )
            })}
          </ul>
          {count > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="w-full border-t border-line px-4 py-2.5 text-left text-sm text-muted hover:text-terracotta"
            >
              Tout effacer
            </button>
          )}
        </div>
      )}
    </div>
  )
}
