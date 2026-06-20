import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { App } from './App'
import { HomePage } from './pages/HomePage'
import { RecipePage } from './pages/RecipePage'

// Mode sombre : applique la préférence stockée ou système avant le rendu.
const stored = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
if (stored === 'dark' || (!stored && prefersDark)) {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="recette/:id" element={<RecipePage />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
