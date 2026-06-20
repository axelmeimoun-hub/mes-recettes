import type { RecipeIngredient } from '../types/db'
import { formatPrice, formatQuantity, lineCost, lineQuantity } from '../lib/format'

interface Props {
  line: RecipeIngredient
  portions: number
  dimmed?: boolean // facultatif non compté dans le prix
}

export function IngredientRow({ line, portions, dimmed }: Props) {
  const ing = line.ingredients
  const qty = lineQuantity(line, portions)
  const cost = lineCost(line, portions)

  return (
    <li
      className={[
        'flex items-baseline justify-between gap-3 py-3',
        dimmed ? 'opacity-55' : '',
      ].join(' ')}
    >
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="font-medium">{ing?.name ?? 'Ingrédient inconnu'}</span>
          {line.optional && (
            <span className="rounded-full bg-olive/15 px-2 py-0.5 text-xs text-olive">
              facultatif
            </span>
          )}
        </p>
        {(ing?.comment || line.comment) && (
          <div className="space-y-0.5">
            {ing?.comment && (
              <p className="text-sm text-muted">{ing.comment}</p>
            )}
            {line.comment && (
              <p className="text-sm text-muted">{line.comment}</p>
            )}
          </div>
        )}
      </div>

      <div className="tabular shrink-0 text-right">
        <p className="text-lg font-semibold">
          {ing ? formatQuantity(qty, ing.unit) : '—'}
        </p>
        <p className="text-sm text-muted">{formatPrice(cost)}</p>
      </div>
    </li>
  )
}
