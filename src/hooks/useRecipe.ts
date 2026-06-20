import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { RecipeWithIngredients } from '../types/db'

interface State {
  data: RecipeWithIngredients | null
  loading: boolean
  error: string | null
}

/** Charge une recette complète (lignes d'ingrédients + ingrédients embarqués). */
export function useRecipe(id: number | null): State {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (id == null || Number.isNaN(id)) {
      setState({ data: null, loading: false, error: 'Identifiant invalide' })
      return
    }

    let cancelled = false
    setState({ data: null, loading: true, error: null })

    supabase
      .from('recipes')
      .select('*, recipe_ingredients(*, ingredients(*))')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setState({ data: null, loading: false, error: error.message })
        } else {
          setState({
            data: data as RecipeWithIngredients,
            loading: false,
            error: null,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return state
}
