import { formatPrice } from '../lib/format'

interface Props {
  total: number
  perPortion: number
  portionLabel: string
}

/** Coût total + coût par portion, gros chiffres lisibles en cuisine. */
export function CostSummary({ total, perPortion, portionLabel }: Props) {
  const unit = portionLabel.replace(/s$/, '')
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl2 border border-line bg-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Coût total
        </p>
        <p className="tabular mt-1 font-display text-lg font-semibold sm:text-xl">
          {formatPrice(total)}
        </p>
      </div>
      <div className="rounded-xl2 border border-line bg-terracotta/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-terracotta">
          Par {unit}
        </p>
        <p className="tabular mt-1 font-display text-lg font-semibold text-terracotta sm:text-xl">
          {formatPrice(perPortion)}
        </p>
      </div>
    </div>
  )
}
