import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { RecipeWithIngredients } from '../types/db'

interface State {
  data: RecipeWithIngredients[] | null
  loading: boolean
  error: string | null
}

/**
 * Charge toutes les recettes avec leurs lignes d'ingrédients embarquées.
 * On embarque les ingrédients pour pouvoir calculer un coût/portion indicatif
 * directement sur les cartes (à base_portions).
 */
export function useRecipes(): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    supabase
      .from('recipes')
      .select('*, recipe_ingredients(*, ingredients(*))')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setState({ data: null, loading: false, error: error.message })
        } else {
          setState({
            data: (data ?? []) as RecipeWithIngredients[],
            loading: false,
            error: null,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
