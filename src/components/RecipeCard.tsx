import { Link } from 'react-router-dom'
import type { RecipeWithIngredients } from '../types/db'
import { costPerPortion, formatPrice } from '../lib/format'

interface Props {
  recipe: RecipeWithIngredients
}

export function RecipeCard({ recipe }: Props) {
  // Coût/portion indicatif calculé à base_portions, facultatifs inclus.
  const perPortion = costPerPortion(
    recipe.recipe_ingredients ?? [],
    recipe.base_portions,
    true,
  )

  return (
    <Link
      to={`/recette/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-xl2 border border-line bg-surface transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-4xl opacity-40">
            🍽️
          </div>
        )}
        {perPortion > 0 && (
          <span className="tabular absolute bottom-2 right-2 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-semibold text-cream">
            {formatPrice(perPortion)} / {recipe.portion_label.replace(/s$/, '')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg font-semibold leading-snug">
          {recipe.name}
        </h3>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          <Tag>{recipe.type}</Tag>
          <Tag muted>{recipe.origin}</Tag>
        </div>
      </div>
    </Link>
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
        'rounded-full px-2.5 py-0.5 text-xs capitalize',
        muted
          ? 'bg-olive/15 text-olive'
          : 'bg-terracotta/15 text-terracotta',
      ].join(' ')}
    >
      {children}
    </span>
  )
}
