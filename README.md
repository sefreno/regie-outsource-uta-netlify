# UTA Workflow

## Description

UTA Workflow est une application de gestion des processus d'installation et de rénovation. Elle permet de centraliser la gestion des dossiers clients à travers tous les services impliqués dans le processus.

## Fonctionnalités

- Gestion centralisée des workflows
- Système de messagerie inter-services
- Tableaux de bord de performances des collaborateurs
- Gestion des rendez-vous et visites techniques
- Facturation avancée et reporting

## Technologies utilisées

- Next.js
- React
- Tailwind CSS
- Shadcn/UI
- Node.js

## Déploiement

Plusieurs options de déploiement sont disponibles :

1. **Netlify** (recommandé)
2. **Docker**
3. **Serveur dédié**

Pour des instructions détaillées, consultez la documentation de déploiement incluse dans ce dépôt.

## Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/votre-organisation/uta-workflow.git

# Naviguer dans le répertoire
cd uta-workflow

# Installer les dépendances
bun install
# ou
npm install

# Démarrer le serveur de développement
bun run dev
# ou
npm run dev
```

## Structure du projet

Le projet est organisé selon l'architecture de Next.js :

- `/app` - Pages et routes de l'application
- `/components` - Composants réutilisables
- `/lib` - Utilitaires et fonctions partagées
- `/public` - Ressources statiques

## Licence

Ce projet est sous licence propriétaire. Copyright © 2025 UTA Systems.
