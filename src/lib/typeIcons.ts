// Picto par type d'ingrédient (valeurs de l'enum ingredient_type).
// Sert d'en-tête de groupe et de fallback quand un ingrédient n'a pas d'image.
export const TYPE_ICONS: Record<string, string> = {
  Liquide: '💧',
  Viande: '🥩',
  Poisson: '🐟',
  'Épices et herbes': '🌿',
  Légumes: '🥦',
  Sauce: '🥫',
  'Produits laitiers': '🧀',
  'Aliment de base': '🌾',
  Fruits: '🍎',
  Tartinade: '🍯',
  'Fruits de mer': '🦐',
}

export function typeIcon(type: string | null | undefined): string {
  return (type && TYPE_ICONS[type]) || '🍽️'
}
