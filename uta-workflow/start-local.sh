#!/bin/bash

echo "===== Démarrage de UTA Workflow en local ====="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null
then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer (version 18+ recommandée)."
    exit 1
fi

# Vérifier si Bun est installé
if ! command -v bun &> /dev/null
then
    echo "⚠️ Bun n'est pas installé. Utilisation de npm à la place."
    # Installation des dépendances avec npm
    echo "📦 Installation des dépendances..."
    npm install

    # Démarrage du serveur de développement
    echo "🚀 Démarrage du serveur Next.js..."
    npm run dev
else
    # Installation des dépendances avec Bun (plus rapide)
    echo "📦 Installation des dépendances avec Bun..."
    bun install

    # Démarrage du serveur de développement
    echo "🚀 Démarrage du serveur Next.js avec Bun..."
    bun run dev
fi
