import type { RecipeIngredient, UnitType } from '../types/db'

// --- Formatage français ---------------------------------------------------

const eur = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Prix en euros, format français : 1,50 €. */
export function formatPrice(value: number): string {
  if (!isFinite(value)) return '—'
  return eur.format(value)
}

const qtyFmt = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

/** Quantité arrondie proprement (1 décimale max) avec l'unité. */
export function formatQuantity(value: number, unit: UnitType): string {
  const n = qtyFmt.format(value)
  if (unit === 'unit') return n
  return `${n} ${unit}` // espace insécable avant g / ml
}

// --- Calculs de coûts -----------------------------------------------------

/** Quantité d'une ligne pour P portions. */
export function lineQuantity(line: RecipeIngredient, portions: number): number {
  return line.quantity_per_portion * portions
}

/** Coût d'une ligne pour P portions (0 si ingrédient inconnu). */
export function lineCost(line: RecipeIngredient, portions: number): number {
  const price = line.ingredients?.price_per_unit ?? 0
  return lineQuantity(line, portions) * price
}

/**
 * Coût total d'une recette pour P portions.
 * `includeOptional` : prend en compte (ou non) les ingrédients facultatifs.
 */
export function totalCost(
  lines: RecipeIngredient[],
  portions: number,
  includeOptional: boolean,
): number {
  return lines.reduce((sum, line) => {
    if (!includeOptional && line.optional) return sum
    return sum + lineCost(line, portions)
  }, 0)
}

/** Coût par portion. */
export function costPerPortion(
  lines: RecipeIngredient[],
  portions: number,
  includeOptional: boolean,
): number {
  if (portions <= 0) return 0
  return totalCost(lines, portions, includeOptional) / portions
}

/** Découpe `prep_steps` (séparateur \n) en étapes nettoyées. */
export function splitSteps(prep: string | null): string[] {
  if (!prep) return []
  return prep
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}
