// Types reflétant le schéma `public` de Supabase (déjà créé et rempli).

export type IngredientType =
  | 'Liquide'
  | 'Viande'
  | 'Poisson'
  | 'Épices et herbes'
  | 'Légumes'
  | 'Sauce'
  | 'Produits laitiers'
  | 'Aliment de base'
  | 'Fruits'
  | 'Tartinade'
  | 'Fruits de mer'

export type UnitType = 'g' | 'ml' | 'unit'

export type RecipeType =
  | 'entrée'
  | 'plat'
  | 'dessert'
  | 'cocktail'
  | 'apéritif'
  | 'boisson'

export type RecipeOrigin =
  | 'classique français'
  | 'oriental'
  | 'grec'
  | 'africain'
  | 'italien'
  | 'asiatique'
  | 'mexicain'
  | 'américain'
  | 'indien'
  | 'libanais'

export type PortionUnit =
  | 'personnes'
  | 'pots'
  | 'pancakes'
  | 'pièces'
  | 'parts'
  | 'verres'

export interface Ingredient {
  id: number
  name: string
  type: IngredientType
  unit: UnitType
  price_per_unit: number
  comment: string | null
}

export interface RecipeIngredient {
  id: number
  recipe_id: number
  ingredient_id: number
  quantity_per_portion: number
  optional: boolean
  comment: string | null
  sort_order: number | null
  // Embed PostgREST
  ingredients: Ingredient | null
}

export interface Recipe {
  id: number
  name: string
  type: RecipeType
  origin: RecipeOrigin
  category: string | null
  description: string | null
  portion_label: PortionUnit
  base_portions: number
  prep_steps: string | null
  image_url: string | null
  source_url: string | null
  created_at: string
}

// Recette complète avec ses lignes d'ingrédients embarquées.
export interface RecipeWithIngredients extends Recipe {
  recipe_ingredients: RecipeIngredient[]
}
