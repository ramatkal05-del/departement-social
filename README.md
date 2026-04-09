# Social Department - Gestion de Trésorerie

Système de gestion financière pour département d'église, entièrement en français.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ramatkal05-del/D-partement-Social)

## 🚀 Déploiement Rapide

### Déployer sur Vercel (Recommandé)

1. Cliquez sur le bouton "Deploy with Vercel" ci-dessus
2. Connectez-vous avec GitHub
3. Configurez les variables d'environnement :
   - `SUPABASE_URL` : Votre URL Supabase
   - `SUPABASE_ANON_KEY` : Votre clé anon Supabase
4. Cliquez sur "Deploy"

📖 Voir le [Guide de Déploiement Complet](DEPLOYMENT.md)

## Stack Technique

- **HTML5** - Structure des pages
- **Tailwind CSS** - Styling et responsive design
- **Alpine.js** - Interactivité réactive côté client
- **Supabase** - Base de données PostgreSQL + Authentification
- **jsPDF** - Génération de rapports PDF

## Fonctionnalités

### Gestion des Membres
- ✅ Profils complets avec email et téléphone
- ✅ Assignation aux départements
- ✅ Statut actif/inactif

### Gestion Financière
- ✅ Départements avec types de cotisation (fixe/libre)
- ✅ Périodes mensuelles avec génération automatique des cotisations
- ✅ Enregistrement des paiements multi-devises
- ✅ Répartition automatique des paiements
- ✅ Gestion des dépenses par catégorie
- ✅ Suivi des cultes et dette de salle

### Rapports & Export
- ✅ Rapports financiers complets
- ✅ Taux de recouvrement par département
- ✅ Liste détaillée des membres par département
- ✅ Export PDF professionnel avec logo
- ✅ Suivi des paiements en retard

### Interface & UX
- ✅ Authentification sécurisée
- ✅ Interface 100% en français
- ✅ Design responsive (mobile-friendly)
- ✅ Upload du logo de l'église
- ✅ Statuts en temps réel

## Structure du Projet

```
D-partement-Social/
├── index.html              # Page de connexion
├── dashboard.html          # Tableau de bord
├── membres.html            # Gestion des membres
├── departements.html       # Gestion des départements
├── cotisations.html        # Périodes et cotisations
├── contributions.html      # Enregistrement des contributions
├── cultes.html             # Cultes & Dette Salle
├── depenses.html           # Gestion des dépenses
├── rapports.html           # Rapports financiers avec export PDF
├── config.js               # Configuration Supabase (environnement)
├── vercel.json             # Configuration Vercel
├── .env.example            # Template variables d'environnement
├── js/
│   ├── supabase.js         # Client Supabase
│   ├── auth.js             # Gestion authentification
│   ├── utils.js            # Utilitaires (formatage, conversion)
│   └── store.js            # Store global Alpine.js
├── supabase_migration_v3.sql  # Schéma de base de données
└── supabase_functions.sql     # Fonctions et vues SQL
```

## Installation Locale

### Prérequis
- Node.js (v14 ou supérieur)
- Un projet Supabase configuré

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/ramatkal05-del/D-partement-Social.git
cd D-partement-Social
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos identifiants Supabase
```

4. **Configurer la base de données**
- Allez dans votre projet Supabase
- Ouvrez SQL Editor
- Exécutez `supabase_migration_v3.sql`
- Exécutez `supabase_functions.sql`

5. **Créer un utilisateur**
- Authentication > Users > Add user
- Créez un compte avec email/mot de passe

6. **Lancer l'application**
```bash
npm start
```

L'application s'ouvrira automatiquement sur `http://localhost:8080`

## Configuration de Supabase

### 1. Créer un projet
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez l'URL et la clé anon dans **Settings > API**

### 2. Exécuter les migrations
Dans **SQL Editor**, exécutez :
1. `supabase_migration_v3.sql` (crée les tables)
2. `supabase_functions.sql` (crée les vues et fonctions)

### 3. Configurer l'authentification
- Allez dans **Authentication > Settings**
- Désactivez "Confirm email" pour un accès direct
- Créez vos utilisateurs

### 4. Sécurité (Optionnel mais recommandé)
Activez Row Level Security (RLS) :
```sql
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
-- Voir DEPLOYMENT.md pour les politiques complètes
```

## Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

Ou utilisez le bouton "Deploy with Vercel" ci-dessus.

### Netlify
```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod
```

### GitHub Pages
1. Poussez sur la branche `gh-pages`
2. Activez GitHub Pages dans Settings

📖 Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour les instructions détaillées.

## Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-clé-anon-ici
```

**⚠️ Important :** Ne jamais commiter le fichier `.env` !

## Utilisation

### 1. Première connexion
- Ouvrez l'application
- Connectez-vous avec vos identifiants Supabase

### 2. Configuration initiale
1. Créez vos départements
2. Ajoutez vos membres
3. Assignez les membres aux départements
4. Créez une période mensuelle

### 3. Utilisation quotidienne
- Enregistrez les contributions
- Ajoutez les dépenses
- Suivez les cultes et la dette de salle
- Générez les rapports mensuels

### 4. Export PDF
- Allez dans Rapports
- Sélectionnez une période
- Ajoutez le logo de votre église
- Cliquez sur "Télécharger PDF"

## Captures d'écran

Le système comprend :
- **Tableau de bord** : Vue d'ensemble avec statistiques
- **Membres** : Liste complète avec recherche et filtres
- **Départements** : Gestion par type de contribution
- **Contributions** : Enregistrement rapide des paiements
- **Rapports** : Analyse financière complète avec export PDF

## Contributions

Les contributions sont les bienvenues !

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## License

Ce projet est sous license MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support

- 📧 Email : Support via GitHub Issues
- 🐛 Bugs : [Ouvrir une issue](https://github.com/ramatkal05-del/D-partement-Social/issues)
- 📖 Documentation : [DEPLOYMENT.md](DEPLOYMENT.md)

## Remerciements

- **Supabase** pour la base de données et l'authentification
- **Tailwind CSS** pour le framework CSS
- **Alpine.js** pour la réactivité
- **jsPDF** pour la génération de PDF

---

**Version :** 2.0.0  
**Dernière mise à jour :** Avril 2026  
**Développé avec ❤️ pour la communauté**
