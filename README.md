# Social Department - Gestion de Trésorerie

Système de gestion financière pour département d'église, entièrement en français.

## Stack Technique

- **HTML5** - Structure des pages
- **Tailwind CSS** - Styling et responsive design
- **Alpine.js** - Interactivité réactive côté client
- **Supabase** - Base de données PostgreSQL + Authentification

## Fonctionnalités

- Gestion des membres avec numéros WhatsApp
- Gestion des départements (types de cotisation fixe/libre)
- Périodes mensuelles avec génération automatique des cotisations
- Enregistrement des paiements avec répartition automatique
- Gestion des dépenses par catégorie
- Rapports financiers avec taux de recouvrement
- Authentification sécurisée
- Interface 100% en français

## Structure

```
new-version/
├── index.html              # Page de connexion
├── dashboard.html          # Tableau de bord
├── membres.html            # Gestion des membres
├── departements.html       # Gestion des départements
├── cotisations.html        # Périodes et cotisations
├── contributions.html       # Enregistrement des contributions
├── depenses.html           # Gestion des dépenses
├── rapports.html           # Rapports financiers
├── js/
│   ├── supabase.js         # Client Supabase
│   ├── auth.js             # Gestion authentification
│   ├── utils.js            # Utilitaires (formatage, conversion)
│   └── store.js            # Store global Alpine.js
└── supabase_migration.sql  # Script SQL pour créer les tables
```

## Configuration

1. Créer un projet sur [Supabase](https://supabase.com)
2. Exécuter `supabase_migration.sql` dans l'éditeur SQL
3. Copier l'URL et la clé anon dans `js/supabase.js`:

```javascript
const SUPABASE_URL = 'https://votre-projet.supabase.co'
const SUPABASE_KEY = 'votre-cle-anon'
```

4. Créer un utilisateur dans Supabase Auth
5. Ouvrir `index.html` dans un navigateur

## Déploiement

Déployer sur n'importe quel hébergement statique:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## WhatsApp (Optionnel)

Pour les rappels WhatsApp, l'application Next.js dans le dossier parent gère cette fonctionnalité avec `whatsapp-web.js`.
