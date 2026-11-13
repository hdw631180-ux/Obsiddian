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

## Cerveau Synapse et cellules explorateurs

- Le cube est le cerveau : toute question tapée dans le chatbot part vers Ollama, avec les notes proches et un extrait Wikipédia récent comme contexte.
- Toutes les 14 s environ, une cellule du cerveau part explorer un sujet du coffre : le navigateur interroge Wikipédia (Ollama n'a pas d'accès web par lui-même), Ollama résume en un fait utile (sans Ollama, un extrait brut est gardé), et la découverte est rangée sur la note (section « Découvertes du web », 8 maximum par note, stockées dans le navigateur).
- L'info voyage sur la fibre, dans la couleur de la cellule, jusqu'à la note ; clique sur l'étiquette pour ouvrir la note.
- Réglage : case « Cellules explorateurs » dans les réglages.

## V8 : cerveau Ollama, explorateurs multi-sources

- Le cube est l'étiquette vivante d'Ollama : halo et couleur selon l'état (cyan prêt, rose réfléchit, rouge hors ligne), modèle et nombre de cellules en vol.
- Chaque cellule du cerveau peut partir : Ollama choisit la requête, le navigateur interroge Wikipédia FR/EN, Hacker News et OpenAlex, Ollama résume en un fait.
- L'info voyage sur la fibre de la couleur de la cellule dans une étiquette (source + texte), puis arrive sur la note ; le **Flux du cerveau** (bas gauche, écrans larges) liste les dernières découvertes.
- Réglages : liste des modèles installés, bascule automatique si le modèle choisi est absent, 1 à 4 cellules en vol simultanées.
- Conseil : `qwen2.5:0.5b` est très limité ; préfère `qwen2.5:3b` ou `llama3.2:3b`.

## V9 : cerveau généraliste + mobile

- Le coffre n’est plus limité à un sujet : il démarre avec 3 notes d’accueil, tu écris sur ce que tu veux.
- **Synthèse IA** : bouton dans une note (ou « Synthèse du coffre » dans le chatbot). Le navigateur cherche sur Wikipédia FR/EN, Hacker News et OpenAlex, puis Ollama écrit : Résumé, Ce que le web ajoute, Liens possibles, À creuser. La synthèse est gardée sur la note.
- Chaque **nouvelle note** déclenche automatiquement cette analyse.
- **Version mobile** : `index.html` s’adapte maintenant à l’écran du téléphone, avec la même interface que sur PC (graphe 3D, menu +, recherche, cellules, chatbot, notes). Rotation à un doigt, **pincement à deux doigts pour zoomer**, zones de toucher agrandies, résolution adaptée pour rester fluide. Plus aucune redirection automatique. `m.html` (version légère sans 3D) reste disponible si besoin. Les notes sont partagées entre les deux (même navigateur).
- **Ollama depuis le téléphone** : `localhost` désigne le téléphone. Lance Ollama sur le PC avec `OLLAMA_HOST=0.0.0.0` et `OLLAMA_ORIGINS=*`, puis mets `http://IP-DU-PC:11434` dans Réglages. Une page https (GitHub Pages) ne peut pas appeler un Ollama en http : ouvre `m.html` depuis le PC (`python -m http.server 8000`, puis `http://IP-DU-PC:8000/m.html`) ou passe par un tunnel https (Tailscale, Cloudflare).

## V10 : sources du web, logos, bloc-notes, fichiers

- **10 sources** interrogées en parallèle (Wikipédia FR/EN, Hacker News, OpenAlex, Crossref, Europe PMC, Stack Overflow, GitHub, Open Library, Internet Archive), activables une à une dans Réglages. Les résultats sont classés par pertinence avec la note, et une source déjà beaucoup utilisée sur une note passe après les autres.
- **Tout le web** : un navigateur ne peut pas explorer n'importe quel site tout seul. Deux options dans Réglages : une instance **SearXNG** (recherche web générale, JSON activé) et la lecture des **liens présents dans tes notes** (via r.jina.ai).
- **Logos** : chaque bulle qui voyage sur la fibre, le Flux du cerveau et la liste « Découvertes du web » affichent le logo du site d'origine (Wikipédia, Hacker News, GitHub…, ou le site exact d'un résultat web).
- **Bloc-notes** (bouton dans le menu +) : la première ligne est le titre, enregistrement automatique, « Enregistrer et enrichir » lance 3 cellules explorateurs. Les notes sont les mêmes que partout ailleurs dans Synapse.
- **Fichiers** : bouton « Importer des fichiers » ou glisser-déposer n'importe où sur la page. PDF (avec texte), Word `.docx`, PowerPoint `.pptx`, Excel `.xlsx`, OpenDocument `.odt`, `.txt`, `.md`, `.csv`, `.json`, `.html`, `.rtf`. Le texte devient une note (30 000 caractères maximum) puis est enrichi. Les PDF scannés (images) et les anciens `.doc` ne sont pas lus.

## V11 : mémoire par compte, retours, recherche par le sens

- **Mémoire par compte** : Synapse retient, pour chaque compte séparément, tes centres d'intérêt (notes ouvertes, questions posées, 👍/👎) et tes sources préférées. Elle sert à classer les découvertes, à éviter ce que tu rejettes et à orienter les réponses d'Ollama. Réglages → « Mémoire du compte » : voir ce qui est retenu, couper, effacer.
- **👍 / 👎 / → note** sur chaque découverte : 👍 renforce la source et les sujets, 👎 supprime la découverte et ne la reproposera plus, « → note » en fait une vraie note liée à l'originale.
- **Recherche par le sens** : `ollama pull nomic-embed-text`. Les notes sont indexées en arrière-plan (vecteurs gardés dans le compte). La barre de recherche ajoute une section « PAR LE SENS », chaque note affiche des « Notes proches », et le chatbot utilise ces notes comme contexte.

## V12 : vue 2D façon graphe Obsidian

- Le bouton **2D** affiche un vrai graphe à plat : nœuds gris, hubs plus gros, fibres fines, regroupement automatique par liens (simulation de forces).
- **Rouge** = note enrichie par le cerveau. Anneau blanc = note ouverte. Anneau cyan = résultat de recherche.
- Survol : la note et ses voisines restent allumées, le reste s'éteint. Clic : ouvre la note. Glisser un nœud le déplace, le fond déplace la vue, molette ou pincement pour zoomer, double-clic ou « recadrer » pour tout recentrer.
- Les bulles de logos des sources rejoignent la note enrichie directement dans le graphe 2D. La scène 3D, cachée dans ce mode, est ralentie pour économiser la batterie.

## V13 : vue 2D améliorée

- Disposition recalculée avec une vraie simulation de forces (répulsion Barnes-Hut, liens pondérés par le nombre de voisins) : les hubs se dégagent en étoiles et les groupes se séparent. Le graphe s'affiche déjà stabilisé.
- Bouton ⚙ (en haut à gauche en vue 2D) : répulsion, force et distance des liens, gravité, taille des nœuds, épaisseur des liens, affichage du texte, notes orphelines, **couleurs par dossier**, **voisinage de la note ouverte** (profondeur 1 à 4), mouvement doux. Les réglages sont gardés par compte.
- Survol plus doux (fondu, halo), texte qui apparaît progressivement avec le zoom, nœuds qui respirent légèrement.
