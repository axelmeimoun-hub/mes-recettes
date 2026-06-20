import { createClient } from '@supabase/supabase-js'

const env = import.meta.env as Record<string, string | undefined>
const url = env.VITE_SUPABASE_URL
// Accepte l'ancien nom (anon) et le nouveau (publishable) — même usage côté client.
const anonKey = env.VITE_SUPABASE_ANON_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !anonKey) {
  // Message explicite en dev si le .env n'est pas branché.
  console.error(
    'Variables Supabase manquantes : renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env',
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: { persistSession: false },
})
