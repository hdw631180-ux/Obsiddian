# Synapse

Coffre de notes en graphe 3D (style cerveau), avec chatbot à questions prédéfinies, cellules personnalisables, et comptes locaux.

## Démo

Ouvre simplement `index.html` dans un navigateur moderne (WebGL requis), ou déploie sur **GitHub Pages**.

## Fonctionnalités

- Graphe 3D interactif des notes
- Login / création de compte (stockage local navigateur uniquement)
- Accès **Staff** avec le code `195180` pour voir la liste des comptes
- Synchronisation optionnelle depuis un dépôt GitHub public
- Cellules (raccourcis) personnalisables
- Chatbot de questions prédéfinies (pas d’IA externe)

## Déploiement GitHub Pages

1. Crée un nouveau dépôt sur GitHub (ex. `synapse`)
2. Upload le contenu de ce dossier (au minimum `index.html`)
3. Va dans **Settings → Pages**
4. Source : **Deploy from a branch** → branche `main` → dossier `/ (root)`
5. Après 1–2 minutes, le site sera en ligne sur `https://TON_PSEUDO.github.io/synapse/`

## Notes

- Les comptes et les données restent dans le navigateur de chaque visiteur (localStorage).
- Aucune clé API. Rien n’est envoyé vers un serveur, sauf vers ton Ollama local si tu actives l’IA (voir plus bas).

## V7 — WebGPU + Labo

- **WebGPU** (calcul + rendu des particules sur le GPU, jusqu'à 400 000 particules) ; repli automatique sur le rendu WebGL si le navigateur ne le supporte pas.
- Onglet **Labo** dans le menu `+` : 30 réglages, 12 palettes, 8 préréglages, 18 actions.
- **Ctrl+K** : palette de commandes. Raccourcis : `g` GPU, `c` capture PNG, `p` palette, `b` explosion, `f` plein écran, `x` CRT, `[` `]` particules…
- Série de questions « Fun & GPU » dans le chatbot, feux de départ F1, grain de film, halo du curseur, moniteur de performance, Konami code.

## IA locale (Ollama + qwen2.5:0.5b)

Dans le chatbot (clic sur le cube, ou touche `i`), tape une question libre puis Entrée : l'IA répond au fil de l'eau, avec les notes les plus proches de ta question comme contexte. Une question qui correspond à une question prédéfinie reste traitée par le chatbot classique.

1. Installe [Ollama](https://ollama.com) puis télécharge le modèle : `ollama pull qwen2.5:0.5b`
2. Autorise ton site avant de lancer Ollama (sinon le navigateur bloque la requête) :
   - Windows (PowerShell) : `$env:OLLAMA_ORIGINS="https://TON_PSEUDO.github.io"; ollama serve`
   - macOS : `launchctl setenv OLLAMA_ORIGINS "https://TON_PSEUDO.github.io"` puis relance l'application Ollama
   - Linux (systemd) : `sudo systemctl edit ollama` puis `Environment="OLLAMA_ORIGINS=https://TON_PSEUDO.github.io"`
   - Test en local depuis `index.html` ouvert sans serveur : `OLLAMA_ORIGINS=*`
3. Dans **Réglages**, vérifie l'adresse (`http://localhost:11434`) et le modèle, puis clique sur **Tester la connexion**.

L'IA ne marche que sur la machine où tourne Ollama. Chrome peut demander l'autorisation d'accéder au réseau local : accepte.
