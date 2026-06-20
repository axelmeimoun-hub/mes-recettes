# Mes recettes 🍲

Site de recettes en **lecture seule** : les données vivent dans Supabase (Postgres),
le front React ne fait que **lire et calculer** (jamais écrire). Chaque recette stocke
ses quantités **pour 1 portion** ; un sélecteur de portions recalcule en direct les
quantités et les coûts.

Stack : **React + Vite + TypeScript + Tailwind CSS** + `@supabase/supabase-js`.
Mobile-first (usage principal : téléphone en cuisine). Mode sombre inclus.

---

## Lancer en local

```bash
npm install
cp .env.example .env   # puis renseigne tes valeurs Supabase
npm run dev
```

Le site est dispo sur http://localhost:5173/mes-recettes/

### Variables d'environnement

| Variable                  | Description                                              |
| ------------------------- | ------------------------------------------------------- |
| `VITE_SUPABASE_URL`       | URL du projet Supabase (`https://xxxx.supabase.co`)     |
| `VITE_SUPABASE_ANON_KEY`  | Clé **anon public** (Settings → API du dashboard)       |

> Ces valeurs sont **publiques par design** : la clé `anon` est faite pour être
> exposée côté client, la sécurité repose sur les **RLS en lecture seule**.
> Il n'y a aucun secret à protéger ici.

---

## Build

```bash
npm run build      # génère dist/
npm run preview    # prévisualise le build localement
```

---

## Déploiement — GitHub Pages (repo `axelmeimoun-hub/mes-recettes`)

Le déploiement est automatique via GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) à chaque push sur `main`.

### Réglages à activer une seule fois

1. **Créer le repo** `mes-recettes` sous le compte `axelmeimoun-hub` et y pousser ce dossier.
2. Repo → **Settings → Pages** → *Build and deployment* → **Source : GitHub Actions**.
3. Repo → **Settings → Secrets and variables → Actions → New repository secret**, ajouter :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   (Le build injecte ces valeurs au moment de la compilation.)

Le site sera servi sur **https://axelmeimoun-hub.github.io/mes-recettes/**
(le `base` est déjà réglé sur `/mes-recettes/` dans [`vite.config.ts`](vite.config.ts)).

> Routing en `HashRouter` : les URLs profondes (`/#/recette/12`) fonctionnent au
> rafraîchissement sans configuration 404 côté Pages.

### Commandes git pour initialiser le repo dédié

```bash
# depuis ce dossier (recettes/)
git init
git add .
git commit -m "Site de recettes : front React + Supabase"
git branch -M main
git remote add origin https://github.com/axelmeimoun-hub/mes-recettes.git
git push -u origin main
```

---

## Ajouter une recette (dans Supabase, sans toucher au code)

Tout se fait dans le **dashboard Supabase** — le site reflète les données automatiquement.

1. **Table `recipes`** → *Insert row* : `name`, `type`, `origin`, `category`,
   `portion_label`, `base_portions`, `prep_steps` (une étape par ligne),
   `source_url` (optionnel).
2. **Table `recipe_ingredients`** → ajoute une ligne par ingrédient de la recette :
   - sélectionne la `recipe_id` et l'`ingredient_id` via le **sélecteur de clé
     étrangère** (choix par nom),
   - `quantity_per_portion` = quantité **pour 1 portion**,
   - `optional`, `comment`, `sort_order` (ordre d'affichage).
3. **Image** : upload le fichier dans le bucket Storage **`recipe-images`**, copie
   l'**URL publique** et colle-la dans `recipes.image_url`.

> Si un ingrédient n'existe pas encore, crée-le d'abord dans la table `ingredients`
> (`name`, `type`, `unit`, `price_per_unit`).

---

## Logique de calcul

Pour `P` portions (initialisé à `base_portions`, modifiable, non sauvegardé) :

- quantité ligne = `quantity_per_portion × P`
- coût ligne = quantité ligne × `ingredients.price_per_unit`
- coût total = somme des coûts de ligne (les facultatifs sont inclus/exclus selon le toggle)
- coût par portion = coût total ÷ P

Affichage : quantités à 1 décimale + unité, prix en euros au format français.

---

## Identité visuelle

- **Titres** : *Fraunces* (serif éditoriale, chaleureuse).
- **Corps** : *Inter*.
- **Palette** : crème, terre cuite (terracotta), olive — pilotée par des tokens CSS
  dans [`src/index.css`](src/index.css) (faciles à ajuster, mode clair + sombre).
