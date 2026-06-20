interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
        🔍
      </span>
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher une recette…"
        className="w-full rounded-full border border-line bg-surface py-3.5 pl-11 pr-4 text-base text-ink placeholder:text-muted focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
      />
    </div>
  )
}
