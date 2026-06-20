interface Props {
  label: string
  options: string[]
  selected: Set<string>
  onToggle: (value: string) => void
}

/** Groupe de chips multi-sélection construit à partir de valeurs réelles. */
export function FilterChips({ label, options, selected, onToggle }: Props) {
  if (options.length === 0) return null
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.has(opt)
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(opt)}
              className={[
                'rounded-full border px-3.5 py-2 text-sm capitalize transition-colors',
                active
                  ? 'border-terracotta bg-terracotta text-cream'
                  : 'border-line bg-surface text-ink hover:border-terracotta',
              ].join(' ')}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
