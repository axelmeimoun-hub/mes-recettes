interface Props {
  value: number
  label: string // ex: "personnes", "pots", "pancakes"
  onChange: (value: number) => void
}

/** Sélecteur de portions : − / + et saisie directe. Borné à [1, 999]. */
export function PortionSelector({ value, label, onChange }: Props) {
  const clamp = (n: number) => Math.min(999, Math.max(1, n))
  // Singulier quand il n'y a qu'une portion (ex. "1 tarte" au lieu de "1 tartes").
  const displayLabel = value === 1 ? label.replace(/s$/, '') : label

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-line bg-surface">
        <button
          type="button"
          aria-label="Diminuer"
          onClick={() => onChange(clamp(value - 1))}
          className="grid h-12 w-12 place-items-center rounded-full text-2xl text-ink transition-colors hover:text-terracotta disabled:opacity-30"
          disabled={value <= 1}
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={999}
          value={value}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10)
            if (!Number.isNaN(n)) onChange(clamp(n))
          }}
          className="tabular w-16 border-x border-line bg-transparent py-2 text-center text-2xl font-semibold focus:outline-none"
        />
        <button
          type="button"
          aria-label="Augmenter"
          onClick={() => onChange(clamp(value + 1))}
          className="grid h-12 w-12 place-items-center rounded-full text-2xl text-ink transition-colors hover:text-terracotta"
        >
          +
        </button>
      </div>
      <span className="text-lg text-muted">{displayLabel}</span>
    </div>
  )
}
