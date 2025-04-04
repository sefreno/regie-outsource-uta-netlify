# Guide de déploiement UTA Workflow

Ce document explique comment déployer l'application UTA Workflow sur un environnement serveur spécifique.

## Prérequis

- Node.js v18+
- Bun v1.0.15+ (recommandé)
- Compte Netlify (pour le déploiement cloud)

## Options de déploiement

### 1. Déploiement sur Netlify (Recommandé)

Netlify est la solution recommandée pour déployer cette application car elle offre:
- Une intégration native avec Next.js
- Un scaling automatique
- Des déploiements atomiques
- CDN intégré

#### Étapes pour déployer sur Netlify

1. Créez un compte sur [Netlify](https://netlify.com)
2. Connectez votre dépôt Git ou téléchargez manuellement le dossier `uta-workflow`
3. Configurez les paramètres de build:
   - Commande de build: `bun install && bun run build`
   - Répertoire de publication: `.next`
4. Définissez les variables d'environnement nécessaires dans Netlify:
   - `NODE_VERSION`: `18`
   - `NEXT_TELEMETRY_DISABLED`: `1`
5. Lancez le déploiement

Netlify détectera automatiquement que c'est une application Next.js et utilisera le plugin Netlify Next.js pour optimiser le déploiement.

### 2. Déploiement sur un serveur dédié

Si vous préférez héberger l'application sur votre propre serveur:

#### Installation

1. Clonez le dépôt sur votre serveur
2. Naviguez dans le répertoire `uta-workflow`
3. Installez les dépendances: `bun install` ou `npm install`
4. Construisez l'application: `bun run build` ou `npm run build`
5. Démarrez le serveur: `bun run start` ou `npm run start`

#### Configuration avec PM2 (pour la persistance)

Pour maintenir l'application en cours d'exécution:

```bash
npm install -g pm2
pm2 start npm --name "uta-workflow" -- start
pm2 save
pm2 startup
```

### 3. Déploiement avec Docker

Vous pouvez également conteneuriser l'application:

1. Créez un fichier `Dockerfile` dans le répertoire du projet
2. Utilisez l'image Node.js officielle: `FROM node:18-alpine`
3. Copiez les fichiers du projet et installez les dépendances
4. Exposez le port et définissez la commande de démarrage

## Variables d'environnement

Configurez ces variables d'environnement pour personnaliser le déploiement:

- `PORT`: Port sur lequel l'application sera servie (par défaut: 3000)
- `NODE_ENV`: Environnement (`development`, `production`)

## Dépannage

- **Erreur de mémoire**: Augmentez la limite de mémoire lors de la construction: `NODE_OPTIONS=--max_old_space_size=4096 bun run build`
- **Erreurs de rendu**: Vérifiez que vous utilisez Node.js 18+ et que les dépendances sont correctement installées

## Support

Pour toute assistance avec le déploiement, contactez l'équipe technique.
