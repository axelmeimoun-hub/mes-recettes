import type { RecipeWithIngredients } from '../types/db'
import { typeIcon } from './typeIcons'

// Ordre des rayons dans la liste (les autres types suivent en alphabétique).
const TYPE_ORDER = [
  'Fruits',
  'Légumes',
  'Viande',
  'Poisson',
  'Fruits de mer',
  'Produits laitiers',
  'Aliment de base',
  'Épices et herbes',
  'Sauce',
  'Liquide',
  'Tartinade',
]

export interface ShopItem {
  key: string
  name: string
  unit: string
  qty: number
  /** Vrai si l'ingrédient n'apparaît que comme facultatif dans les recettes choisies. */
  optionalOnly: boolean
  from: string[]
}

export type ShopGroup = [type: string, items: ShopItem[]]

/** Portions par recette sélectionnée (id → nombre). */
export type Selection = Record<number, number>

/** Additionne les ingrédients des recettes choisies et les regroupe par type. */
export function buildShoppingList(
  recipes: RecipeWithIngredients[],
  selection: Selection,
  withOptional: boolean,
): ShopGroup[] {
  const byKey = new Map<string, ShopItem & { type: string }>()

  for (const recipe of recipes) {
    const portions = selection[recipe.id]
    if (!portions) continue
    for (const line of recipe.recipe_ingredients ?? []) {
      const ing = line.ingredients
      if (!ing) continue
      if (line.optional && !withOptional) continue
      const name = ing.name.trim()
      const key = `${name}|${ing.unit}`
      const item = byKey.get(key) ?? {
        key,
        name,
        unit: ing.unit,
        type: ing.type,
        qty: 0,
        optionalOnly: true,
        from: [],
      }
      item.qty += line.quantity_per_portion * portions
      if (!line.optional) item.optionalOnly = false
      if (!item.from.includes(recipe.name)) item.from.push(recipe.name)
      byKey.set(key, item)
    }
  }

  const groups = new Map<string, ShopItem[]>()
  for (const { type, ...item } of byKey.values()) {
    groups.set(type, [...(groups.get(type) ?? []), item])
  }

  const rank = (t: string) => {
    const i = TYPE_ORDER.indexOf(t)
    return i === -1 ? TYPE_ORDER.length : i
  }
  return [...groups.entries()]
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b, 'fr'))
    .map(([type, items]): ShopGroup => [
      type,
      items.sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    ])
}

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 })

/** Quantité arrondie à l'entier supérieur (on n'achète pas 0,4 g). */
export function formatShopQty(item: ShopItem): string {
  const v = Math.ceil(item.qty - 1e-9)
  if (item.unit === 'g') return v >= 1000 ? `${nf.format(v / 1000)} kg` : `${v} g`
  if (item.unit === 'ml') return v >= 1000 ? `${nf.format(v / 1000)} L` : `${v} ml`
  return `× ${v}`
}

/**
 * Texte à coller dans une liste Google Keep : une ligne = une tâche,
 * une ligne vide entre chaque type d'aliment.
 */
export function shoppingText(groups: ShopGroup[], skipped: Set<string>): string {
  return groups
    .map(([type, items]) => {
      const rows = items.filter((i) => !skipped.has(i.key))
      if (!rows.length) return null
      return [
        `${typeIcon(type)} ${type.toUpperCase()}`,
        ...rows.map((i) => `${i.name} ${formatShopQty(i)}`),
      ].join('\n')
    })
    .filter((b): b is string => b !== null)
    .join('\n\n')
}
