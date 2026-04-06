# Guide de Déploiement - Département Social

## 📋 Sommaire
1. [Déploiement sur Vercel](#déploiement-sur-vercel)
2. [Déploiement sur Netlify](#déploiement-sur-netlify)
3. [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
4. [Configuration de Supabase](#configuration-de-supabase)
5. [Variables d'environnement](#variables-denvironnement)

---

## 🚀 Déploiement sur Vercel (Recommandé)

### Méthode 1 : Via l'interface Vercel (Plus simple)

1. **Créer un compte Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub

2. **Importer le projet**
   - Cliquez sur "New Project"
   - Importez le repository `D-partement-Social`
   - Vercel détectera automatiquement le projet statique

3. **Configurer les variables d'environnement**
   - Allez dans Settings > Environment Variables
   - Ajoutez :
     ```
     SUPABASE_URL = https://mhsmivrkptlusphwoote.supabase.co
     SUPABASE_KEY = votre-clé-anon-ici
     ```

4. **Déployer**
   - Cliquez sur "Deploy"
   - Votre application sera disponible sur : `https://departement-social.vercel.app`

### Méthode 2 : Via CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

---

## 🌐 Déploiement sur Netlify

### Via l'interface Netlify

1. **Créer un compte** sur [netlify.com](https://netlify.com)

2. **Connecter le repository GitHub**
   - "New site from Git"
   - Choisissez GitHub
   - Sélectionnez `D-partement-Social`

3. **Configuration du build**
   - Build command: Laisser vide (projet statique)
   - Publish directory: `/` (racine)

4. **Variables d'environnement**
   - Settings > Environment variables
   - Ajouter `SUPABASE_URL` et `SUPABASE_KEY`

5. **Déployer**
   - "Deploy site"

### Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser le site
netlify init

# Déployer
netlify deploy --prod
```

---

## 📄 Déploiement sur GitHub Pages

### Configuration

1. **Créer une branche gh-pages**
```bash
git checkout -b gh-pages
git push origin gh-pages
```

2. **Activer GitHub Pages**
   - Allez dans Settings > Pages
   - Source : Deploy from branch
   - Branch : gh-pages
   - Folder : / (root)

3. **Accéder au site**
   - URL : `https://ramatkal05-del.github.io/D-partement-Social/`

### ⚠️ Important pour GitHub Pages

Pour GitHub Pages, vous devez modifier les chemins dans les fichiers HTML :

```html
<!-- Remplacer -->
<script src="js/supabase.js"></script>

<!-- Par (si le site n'est pas à la racine) -->
<script src="/D-partement-Social/js/supabase.js"></script>
```

Ou utiliser des chemins relatifs :
```html
<script src="./js/supabase.js"></script>
```

---

## 🔧 Configuration de Supabase

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez vos identifiants dans **Settings > API**

### 2. Exécuter les migrations

1. Allez dans **SQL Editor**
2. Exécutez dans l'ordre :
   - `supabase_migration_v3.sql`
   - `supabase_functions.sql`

### 3. Configurer Row Level Security (RLS)

Pour la sécurité, activez RLS sur toutes les tables :

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE expected_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cults ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_contributions ENABLE ROW LEVEL SECURITY;

-- Politiques pour utilisateurs authentifiés
CREATE POLICY "Allow authenticated read access" ON members
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read access" ON departments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Ajoutez d'autres politiques selon vos besoins
```

### 4. Créer un utilisateur

1. Allez dans **Authentication > Users**
2. "Add user" > "Create new user"
3. Entrez email et mot de passe

---

## 🔐 Variables d'environnement

### Pour le développement local

1. Copiez le fichier exemple :
```bash
cp .env.example .env
```

2. Remplissez vos valeurs dans `.env` :
```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-clé-anon-ici
```

### Pour Vercel

```bash
# Via CLI
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY

# Ou via le dashboard Vercel
# Settings > Environment Variables
```

### Pour Netlify

```bash
# Via CLI
netlify env:set SUPABASE_URL "votre-url"
netlify env:set SUPABASE_KEY "votre-clé"

# Ou via le dashboard Netlify
# Settings > Environment variables
```

---

## ✅ Checklist de déploiement

- [ ] Repository GitHub créé et pushé
- [ ] Projet Supabase configuré
- [ ] Migrations SQL exécutées
- [ ] RLS activé et configuré
- [ ] Utilisateur créé dans Supabase Auth
- [ ] Variables d'environnement configurées
- [ ] Application déployée
- [ ] Test de connexion réussi
- [ ] Test des fonctionnalités principales
- [ ] Logo de l'église ajouté
- [ ] Domain personnalisé configuré (optionnel)

---

## 🎯 Fonctionnalités à tester après déploiement

1. ✅ Connexion/Déconnexion
2. ✅ Gestion des membres
3. ✅ Gestion des départements
4. ✅ Création de périodes
5. ✅ Enregistrement des contributions
6. ✅ Gestion des dépenses
7. ✅ Suivi des cultes et dette salle
8. ✅ Génération des rapports
9. ✅ Export PDF avec logo
10. ✅ Upload du logo d'église

---

## 🆘 Dépannage

### Problème : "Supabase not initialized"
- Vérifiez que `config.js` est bien chargé avant `js/supabase.js`
- Vérifiez les variables d'environnement

### Problème : "Row level security policy violation"
- Activez RLS sur les tables concernées
- Créez les politiques appropriées

### Problème : Export PDF ne fonctionne pas
- Vérifiez la connexion internet (jsPDF chargé depuis CDN)
- Ouvrez la console pour voir les erreurs

### Problème : Logo ne s'affiche pas
- Le logo est stocké localement dans le navigateur (localStorage)
- Il faut le re-uploader après avoir vidé le cache

---

## 📞 Support

Pour toute question ou problème :
- Issues GitHub : https://github.com/ramatkal05-del/D-partement-Social/issues
- Documentation Supabase : https://supabase.com/docs
- Documentation Vercel : https://vercel.com/docs

---

**Version :** 2.0.0  
**Dernière mise à jour :** Avril 2026
