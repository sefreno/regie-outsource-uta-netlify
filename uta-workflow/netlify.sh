#!/bin/bash

echo "===== Démarrage du déploiement UTA Workflow ====="

# Installation des dépendances
echo "Installation des dépendances..."
bun install

# Construction de l'application
echo "Construction de l'application Next.js..."
bun run build

echo "===== Déploiement terminé ====="
