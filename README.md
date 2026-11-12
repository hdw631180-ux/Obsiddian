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
- Aucune clé API, aucune donnée n’est envoyée vers un serveur.

## V7 — WebGPU + Labo

- **WebGPU** (calcul + rendu des particules sur le GPU, jusqu'à 400 000 particules) ; repli automatique sur le rendu WebGL si le navigateur ne le supporte pas.
- Onglet **Labo** dans le menu `+` : 30 réglages, 12 palettes, 8 préréglages, 18 actions.
- **Ctrl+K** : palette de commandes. Raccourcis : `g` GPU, `c` capture PNG, `p` palette, `b` explosion, `f` plein écran, `x` CRT, `[` `]` particules…
- Série de questions « Fun & GPU » dans le chatbot, feux de départ F1, grain de film, halo du curseur, moniteur de performance, Konami code.
