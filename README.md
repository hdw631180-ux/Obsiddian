# Synapse

> Ton second cerveau : un coffre de notes en **graphe 3D / 2D**, enrichi automatiquement par des cellules explorateurs et un chatbot qui répond depuis le web, sources à l'appui.

Aucun serveur, aucune clé API, aucune IA externe, aucune installation : tout tourne dans le navigateur et les données restent sur ton appareil.

## Sommaire

1. [Aperçu](#aperçu)
   - [Cube de recherche](#cube-de-recherche)
2. [Démarrage rapide](#démarrage-rapide)
3. [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
4. [Fonctionnalités](#fonctionnalités)
5. [Chatbot web](#chatbot-web)
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
| **Cerveau** | Le cube central : chatbot qui répond depuis le web, avec ses sources |
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

- Barre de recherche dans les notes.

### Enrichissement et retours

- **Synthèse** d'une note ou du coffre : Résumé, Ce que le web ajoute, Liens possibles, À creuser.
- Chaque nouvelle note déclenche automatiquement une analyse.
- Sur chaque découverte : 👍 renforce la source et les sujets, 👎 la supprime et ne la reproposera plus, « → note » en fait une vraie note liée.
- Section « Découvertes du web » (8 maximum par note) et **Flux du cerveau** (bas gauche, grands écrans).

### Comptes

- Création de compte et connexion, en local.
- **Mémoire du compte** (Réglages) : voir, couper ou effacer ce qui est retenu.
- **Export / import** de toutes les données du compte en JSON.

## Cube de recherche

Le cube central est la **recherche du cerveau** (clic ou touche `i`). Une fenêtre s'ouvre avec un radar animé ; pendant que tu tapes, les notes du coffre (titre, tags, texte et découvertes du web) apparaissent par ordre de pertinence et le cerveau 3D scanne. Les anneaux du cube s'accélèrent et son étiquette passe à « recherche ». `Entrée` lance en plus une recherche sur le web (chatbot), `Échap` ferme, « Questions prédéfinies » ouvre l'ancien menu.

**Nourrir le réseau** : les boutons « Pulse réseau » et « Nourrir depuis les notes » envoient aussi des cellules explorateurs sur le web (6 ou 10 notes tirées au hasard, une cellule toutes les 0,7 s) pour rapporter de nouvelles découvertes.

## Chatbot web

Le chatbot n'utilise **aucune IA externe** et n'a besoin d'aucune installation. Clique sur le cube ou appuie sur `i`, puis pose une question.

1. Synapse interroge en parallèle les sources du web activées (Wikipédia, recherche scientifique, communautés tech…).
2. Il découpe les extraits en phrases et garde les plus pertinentes par rapport à ta question (mots-clés, rang de la source).
3. Il rédige la réponse, la fait apparaître progressivement et **cite chaque source** avec un lien cliquable.
4. Il ajoute les notes de ton coffre qui correspondent, et rattache les découvertes aux notes proches.

Une question très courte (« et en France ? ») reprend le sujet de la précédente. Si rien n'est trouvé, il le dit au lieu d'inventer. La **Synthèse** d'une note ou du coffre fonctionne de la même façon : résumé, apports du web, liens possibles, pistes à creuser.

## Sources du web

Les cellules interrogent le web **depuis ton navigateur** (sans serveur intermédiaire). Chaque requête utilise les 4 sources de base plus **10 sources tirées au hasard** parmi celles activées, pour varier sans dépasser les limites des API. Les résultats sont classés par pertinence avec la note ; une source déjà très utilisée passe après les autres.

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
- Le cache (`sw.js`) est versionné (`synapse-v20`). Pour forcer une mise à jour chez les utilisateurs, change ce numéro à chaque déploiement.

## Données et confidentialité

- Comptes, notes, mémoire et vecteurs sont dans le **localStorage / IndexedDB** du navigateur de chaque visiteur. Rien n'est envoyé à un serveur de Synapse.
- Les requêtes de sources partent directement vers les API publiques citées plus haut. 
- Les comptes sont **locaux et non sécurisés** : ils séparent les données sur un même appareil mais ne protègent pas contre quelqu'un qui a accès au navigateur. N'y stocke rien de confidentiel.
- Les mots de passe sont hachés (PBKDF2, sel aléatoire, 150 000 itérations) ; les anciens comptes sont migrés à la prochaine connexion. Il n'y a plus de code Staff.
- Pense à **exporter** régulièrement ton compte (Réglages) : vider les données du navigateur efface le coffre.

## Structure du projet

```
synapse-ghpages/
├── index.html      Application complète (3D, 2D, notes, chatbot web, écran de chargement)
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
| Écran noir, pas de graphe | WebGL désactivé : activer l'accélération matérielle ou essayer `m.html` |
| Le bouton Installer n'apparaît pas | Servir en https (ou `localhost`) et vérifier que `manifest.json` et les icônes sont présents |
| Ancienne version affichée | Changer le nom du cache dans `sw.js`, puis recharger deux fois |
| Un import de PDF reste vide | PDF scanné (image) : non lu, utiliser un PDF avec texte |

## Historique des versions

- **V20** : cube central = recherche du cerveau (radar, résultats animés, anneaux scanner 3D) ; « Pulse réseau » et « Nourrir » partent chercher sur le web.
- **V19** : plus d'Ollama ni de code Staff, chatbot qui répond depuis le web avec ses sources, mots de passe PBKDF2 (8 caractères minimum), bouton « Passer » sur l'écran de chargement.
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
