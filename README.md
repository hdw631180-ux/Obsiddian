# Synapse

> Ton second cerveau : un coffre de notes en **graphe 3D / 2D**, enrichi automatiquement par des cellules explorateurs et un cerveau IA local (Ollama).

Aucun serveur, aucune clé API, aucune installation obligatoire : tout tourne dans le navigateur et les données restent sur ton appareil.

## Sommaire

1. [Aperçu](#aperçu)
2. [Démarrage rapide](#démarrage-rapide)
3. [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
4. [Fonctionnalités](#fonctionnalités)
5. [IA locale avec Ollama](#ia-locale-avec-ollama)
6. [Sources du web](#sources-du-web)
7. [Application installable et hors ligne](#application-installable-et-hors-ligne)
8. [Données et confidentialité](#données-et-confidentialité)
9. [Structure du projet](#structure-du-projet)
10. [Dépannage](#dépannage)
11. [Historique des versions](#historique-des-versions)

## Aperçu

| | |
|---|---|
| **Graphe** | Vue 3D (Three.js) ou vue 2D façon Obsidian avec simulation de forces |
| **Notes** | Bloc-notes intégré, import de fichiers (PDF, Word, PowerPoint, Excel…) |
| **Cerveau** | Le cube central : étiquette vivante d'Ollama (cyan prêt, rose réfléchit, rouge hors ligne) |
| **Cellules** | Toutes les 5 s, une vague de cellules part chercher des informations et les rattache aux notes |
| **Mémoire** | Centres d'intérêt et sources préférées retenus **par compte** |
| **Mobile** | Même interface sur téléphone, `m.html` en version légère sans 3D |

Au lancement, un **écran de chargement de 10 secondes** (réseau de neurones animé, barre de progression) précède la page de connexion. Il s'affiche à chaque ouverture de l'application.

## Démarrage rapide

**Sans installation** : ouvre `index.html` dans un navigateur récent (WebGL requis).

**Avec un petit serveur local** (recommandé, nécessaire pour le mode hors ligne et l'installation) :

```bash
cd synapse-ghpages
python -m http.server 8000
# puis ouvre http://localhost:8000
```

Au premier lancement, crée un compte (stocké uniquement dans ton navigateur). Le coffre démarre avec 3 notes d'accueil.

## Déploiement sur GitHub Pages

1. Crée un dépôt GitHub (ex. `synapse`).
2. Envoie **tous** les fichiers du dossier : `index.html`, `m.html`, `sw.js`, `manifest.json`, `icon-192.png`, `icon-512.png`.
3. **Settings → Pages → Deploy from a branch** → branche `main`, dossier `/ (root)`.
4. Après 1 à 2 minutes : `https://TON_PSEUDO.github.io/synapse/`.

> Les 4 fichiers `sw.js`, `manifest.json` et les deux icônes doivent rester à côté de `index.html`, sinon l'installation et le hors ligne ne fonctionnent pas.

## Fonctionnalités

### Notes et graphe

- Graphe 3D interactif : rotation à un doigt ou à la souris, **pincement à deux doigts** pour zoomer.
- **Vue 2D** (bouton `2D`) : nœuds gris, hubs plus gros, fibres fines.
  - Rouge : note enrichie. Anneau blanc : note ouverte. Anneau cyan : résultat de recherche.
  - Survol : la note et ses voisines restent allumées. Clic : ouvre la note. Glisser : déplace un nœud. Double-clic : recadre.
  - Bouton ⚙ : répulsion, force et distance des liens, gravité, taille, épaisseur, texte, orphelines, couleurs par dossier, voisinage (profondeur 1 à 4), mouvement doux. Réglages gardés par compte.
  - **Timeline** pour revoir l'enrichissement dans le temps, **Présentation** (plein écran, visite automatique des hubs, `Échap` pour quitter), **Image** (export PNG).
  - **Cellules d'enrichissement** en orbite autour de chaque note : bleu = savoir, vert = science, rouge = tech et communauté. Clic sur la légende pour masquer une couleur.
- **Bloc-notes** (menu +) : la première ligne est le titre, enregistrement automatique, « Enregistrer et enrichir » lance 3 cellules.
- **Import de fichiers** par bouton ou glisser-déposer : PDF (avec texte), `.docx`, `.pptx`, `.xlsx`, `.odt`, `.txt`, `.md`, `.csv`, `.json`, `.html`, `.rtf` (30 000 caractères maximum par fichier). Les PDF scannés et les anciens `.doc` ne sont pas lus.

### Recherche

- Barre de recherche classique dans les notes.
- **Recherche par le sens** (embeddings `nomic-embed-text`) : section « PAR LE SENS », « Notes proches » sur chaque note.

### Enrichissement et retours

- **Synthèse IA** d'une note ou du coffre : Résumé, Ce que le web ajoute, Liens possibles, À creuser.
- Chaque nouvelle note déclenche automatiquement une analyse.
- Sur chaque découverte : 👍 renforce la source et les sujets, 👎 la supprime et ne la reproposera plus, « → note » en fait une vraie note liée.
- Section « Découvertes du web » (8 maximum par note) et **Flux du cerveau** (bas gauche, grands écrans).

### Comptes

- Création de compte et connexion, en local.
- Accès **Staff** pour consulter la liste des comptes de l'appareil (le code se règle dans `index.html`, voir [Confidentialité](#données-et-confidentialité)).
- **Mémoire du compte** (Réglages) : voir, couper ou effacer ce qui est retenu.
- **Export / import** de toutes les données du compte en JSON.

## IA locale avec Ollama

L'IA est **optionnelle**. Sans Ollama, Synapse garde un extrait brut des sources et le chatbot répond aux questions prédéfinies.

1. Installe [Ollama](https://ollama.com), puis télécharge un modèle :

   ```bash
   ollama pull qwen2.5:3b          # ou llama3.2:3b (qwen2.5:0.5b est très limité)
   ollama pull nomic-embed-text    # pour la recherche par le sens
   ```

2. Autorise ton site **avant** de lancer Ollama (sinon le navigateur bloque la requête) :

   | Système | Commande |
   |---|---|
   | Windows (PowerShell) | `$env:OLLAMA_ORIGINS="https://TON_PSEUDO.github.io"; ollama serve` |
   | macOS | `launchctl setenv OLLAMA_ORIGINS "https://TON_PSEUDO.github.io"` puis relance Ollama |
   | Linux (systemd) | `sudo systemctl edit ollama` puis `Environment="OLLAMA_ORIGINS=https://TON_PSEUDO.github.io"` |
   | Test local sans serveur | `OLLAMA_ORIGINS=*` |

3. Dans **Réglages**, vérifie l'adresse (`http://localhost:11434`) et le modèle, puis **Tester la connexion**.

Le chatbot s'ouvre en cliquant sur le cube ou avec la touche `i`. Une question libre part vers Ollama avec les notes proches et un extrait du web comme contexte ; une question prédéfinie reste traitée sans IA.

### Depuis un téléphone

`localhost` désigne alors le téléphone. Lance Ollama sur le PC avec `OLLAMA_HOST=0.0.0.0` et `OLLAMA_ORIGINS=*`, puis saisis `http://IP-DU-PC:11434` dans Réglages. Une page **https** (GitHub Pages) ne peut pas appeler un Ollama en **http** : ouvre plutôt `m.html` depuis le PC (`python -m http.server 8000`, puis `http://IP-DU-PC:8000/m.html`) ou passe par un tunnel https (Tailscale, Cloudflare).

## Sources du web

Les cellules interrogent le web **depuis ton navigateur** (Ollama n'a pas d'accès web par lui-même). Chaque requête utilise les 4 sources de base plus **10 sources tirées au hasard** parmi celles activées, pour varier sans dépasser les limites des API. Les résultats sont classés par pertinence avec la note ; une source déjà très utilisée passe après les autres.

| Famille | Exemples |
|---|---|
| Encyclopédies | Wikipédia (FR/EN + 28 langues), 35 projets Wikimédia (Wiktionnaire, Wikisource, Wikivoyage…) |
| Science | OpenAlex, Crossref, Europe PMC, Semantic Scholar, DOAJ, INSPIRE, Zenodo, PubChem, NASA |
| Nature | iNaturalist, GBIF |
| Tech et communauté | Hacker News, Stack Overflow + 36 communautés Stack Exchange, GitHub, npm, crates.io, Packagist, RubyGems, Hugging Face |
| Culture | Open Library, Internet Archive, Gutenberg, Art Institute |
| Divers | Open Food Facts, TheMealDB, OpenStreetMap, Datamuse |

Pour aller plus loin, Réglages propose une instance **SearXNG** (recherche web générale, JSON activé) et la lecture des **liens présents dans tes notes** (via r.jina.ai). Un navigateur ne peut pas explorer n'importe quel site seul.

Réglages utiles : activer ou couper chaque source, nombre de cellules par vague (1 à 8), cellules en vol simultanées (1 à 4), bascule automatique si le modèle choisi est absent.

## Application installable et hors ligne

- Après un premier chargement en ligne, Synapse s'ouvre **sans connexion** avec tes notes ; l'enrichissement reprend au retour du réseau.
- Bouton **Installer l'application** dans Réglages (si le navigateur le propose).
- Le cache (`sw.js`) est versionné (`synapse-v18`). Pour forcer une mise à jour chez les utilisateurs, change ce numéro à chaque déploiement.

## Données et confidentialité

- Comptes, notes, mémoire et vecteurs sont dans le **localStorage / IndexedDB** du navigateur de chaque visiteur. Rien n'est envoyé à un serveur de Synapse.
- Les requêtes de sources partent directement vers les API publiques citées plus haut. Seule exception côté IA : ton Ollama local.
- Les comptes sont **locaux et non sécurisés** : ils séparent les données sur un même appareil mais ne protègent pas contre quelqu'un qui a accès au navigateur. N'y stocke rien de confidentiel.
- Le code d'accès Staff est écrit dans `index.html`, donc **lisible par tout visiteur** d'un site public. Ne le considère pas comme un secret, et ne le publie pas dans le README.
- Pense à **exporter** régulièrement ton compte (Réglages) : vider les données du navigateur efface le coffre.

## Structure du projet

```
synapse-ghpages/
├── index.html      Application complète (3D, 2D, notes, IA, écran de chargement)
├── m.html          Version mobile légère, sans 3D
├── sw.js           Service worker (hors ligne)
├── manifest.json   Manifeste d'installation (PWA)
├── icon-192.png    Icône
├── icon-512.png    Icône
└── README.md
```

## Dépannage

| Problème | Piste |
|---|---|
| Cube rouge / « hors ligne » | Ollama n'est pas lancé, ou `OLLAMA_ORIGINS` ne contient pas l'adresse du site |
| Le test de connexion échoue depuis GitHub Pages | Page https vers Ollama http : autoriser l'accès réseau local dans Chrome, ou utiliser un tunnel https |
| Pas de « PAR LE SENS » | `ollama pull nomic-embed-text`, puis attendre l'indexation en arrière-plan |
| Écran noir, pas de graphe | WebGL désactivé : activer l'accélération matérielle ou essayer `m.html` |
| Le bouton Installer n'apparaît pas | Servir en https (ou `localhost`) et vérifier que `manifest.json` et les icônes sont présents |
| Ancienne version affichée | Changer le nom du cache dans `sw.js`, puis recharger deux fois |
| Un import de PDF reste vide | PDF scanné (image) : non lu, utiliser un PDF avec texte |

## Historique des versions

- **V18** : écran de chargement de 10 secondes avant la connexion, README complet, cache `synapse-v18`.
- **V17** : application installable et hors ligne ; vue 2D avec légende cliquable, Timeline, Présentation et export PNG.
- **V16** : ~120 sources supplémentaires, requêtes à 4 sources de base + 10 aléatoires, export/import du compte, stockage durable.
- **V15** : cellules d'enrichissement colorées en orbite dans la vue 2D.
- **V14** : vagues de cellules toutes les 5 s, espacement de GitHub, Stack Overflow et Crossref.
- **V13** : vue 2D améliorée (Barnes-Hut, réglages ⚙, couleurs par dossier, voisinage).
- **V12** : vue 2D façon graphe Obsidian.
- **V11** : mémoire par compte, 👍 / 👎 / → note, recherche par le sens.
- **V10** : 10 sources, logos, bloc-notes, import de fichiers, SearXNG.
- **V9** : coffre généraliste, synthèse IA, version mobile.
- **V8** : cerveau Ollama, explorateurs multi-sources, Flux du cerveau.
