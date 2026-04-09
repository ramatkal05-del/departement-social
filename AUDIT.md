## Audit rapide

### Synthèse
- Projet SPA statique (HTML + Alpine.js) avec Supabase en mode client-only. Pas de build ni de bundler; dépendances chargées via CDN.
- Déploiement ciblé Vercel/Netlify comme site statique.

### Problèmes critiques
1) Incohérence des variables d'env Supabase (corrigée) : aligné sur `SUPABASE_URL` + `SUPABASE_ANON_KEY` côté process/window. Réfs : [`config.js`](config.js:11), [`.env.example`](.env.example:5).
2) Fuite d'URL Supabase de prod dans la doc (risque d'exposition de surface d'attaque). Réf : [`DEPLOYMENT.md`](DEPLOYMENT.md:29).
3) Dépendances CDN non verrouillées (`@supabase/supabase-js@2` via unpkg) → dérives de version possibles et absence de SRI. Réf : [`index.html`](index.html:9).
4) Aucun fallback de configuration côté client : si `SUPABASE_CONFIG` est vide, le code se contente de logger sans guidage UI et laisse l'app dans un état muet. Réf : [`js/supabase.js`](js/supabase.js:16).

### Observations supplémentaires
- Architecture front unique par page avec injection de layout via `UIManager`, pas de routing ni de code-splitting.
- Auth : stockage en `localStorage` sans persistance sécurisée ; pas de vérification de rôle ni de politiques RLS documentées côté client (RLS seulement mentionné dans la doc). Réfs : [`js/auth.js`](js/auth.js:64), [`DEPLOYMENT.md`](DEPLOYMENT.md:148).
- Absence d'état de chargement/erreur pour la plupart des requêtes Supabase (ex. dashboard) → UX silencieuse en cas d'échec réseau/API. Réf : [`dashboard.html`](dashboard.html:184).
- Pas de tests automatisés, pas de linting/config projet (uniquement `http-server`). Réf : [`package.json`](package.json:5).

### Recommandations prioritaires
1) Unifier les variables d'env : utiliser `SUPABASE_URL` et `SUPABASE_ANON_KEY` partout (process & window), et documenter clairement pour Vercel/Netlify (site statique → injection via inline script ou build step).
2) Retirer/obfusquer l'URL Supabase réelle de la doc publique.
3) Pinner les versions CDN et ajouter SRI (ou servir depuis `node_modules` via build simple).
4) Ajouter une UX d'erreur/config manquante (écran de setup + toasts) lorsque Supabase n'est pas initialisé.
5) Mettre en place un lint minimal (ESLint) et scripts de vérification.
6) Documenter/Rappeler l'activation RLS et les politiques minimales; intégrer un contrôle de rôle côté client pour masquer les actions sensibles.

### Prochaines étapes proposées
- Corriger `config.js` + `.env.example` + docs pour aligner les clés et supporter un mode 100% client (Vercel static).
- Injecter les secrets via `<script>window.SUPABASE_URL=...` dans `vercel.json`/`index.html` template ou ajouter un petit build (vite) pour inline `import.meta.env`.
- Ajouter gestion d'erreurs + loaders sur les appels Supabase critiques (dashboard, membres, paiements, dépenses, rapports).
- Pinner les CDN avec SRI et/ou servir des assets versionnés.
- Ajouter ESLint + script `npm run lint` et CI légère (optionnel mais recommandé).
