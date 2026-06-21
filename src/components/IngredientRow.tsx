import type { RecipeIngredient } from '../types/db'
import { formatPrice, formatQuantity, lineCost, lineQuantity } from '../lib/format'
import { typeIcon } from '../lib/typeIcons'

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
        'flex items-center gap-3 py-3',
        dimmed ? 'opacity-55' : '',
      ].join(' ')}
    >
      {/* Vignette : image de l'ingrédient, ou emoji du type en fallback */}
      <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface">
        {ing?.image_url ? (
          <img
            src={ing.image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <span aria-hidden className="text-xl">
            {typeIcon(ing?.type)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
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
