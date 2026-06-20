import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sert le site sous le sous-chemin du repo.
// Repo dédié : https://axelmeimoun-hub.github.io/mes-recettes/
export default defineConfig({
  plugins: [react()],
  base: '/mes-recettes/',
})
