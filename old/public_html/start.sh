#!/bin/bash

# === CONFIGURAZIONE ===
REPO_PATH="/c/Users/Gaetano/ortodynamic"
GITHUB_URL="https://github.com/GdmDev/ortodynamicweb.git"
COMMIT_MSG="Reset completo e caricamento progetto ortodynamic"

echo "🔄 Spostamento nella cartella del progetto..."
cd "$REPO_PATH" || { echo "❌ Cartella non trovata: $REPO_PATH"; exit 1; }

echo "🧹 Rimozione configurazione Git locale..."
rm -rf .git

echo "🆕 Inizializzazione nuovo repository Git..."
git init

echo "👤 Configurazione autore..."
git config user.name "Gaetano"
git config user.email "gaetano@example.com"

echo "🌱 Creazione branch principale 'main'..."
git checkout -b main

echo "🔗 Collegamento al repository remoto..."
git remote add origin "$GITHUB_URL"

echo "📦 Aggiunta di tutti i file (escludendo 'nul')..."
git add --all ":!nul"

echo "📝 Commit dei file..."
git commit -m "$COMMIT_MSG"

echo "🚀 Push forzato su GitHub (sovrascrive tutto)..."
git push -u origin main --force

echo "✅ Reset e caricamento completato con successo!"
