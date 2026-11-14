# Échéance — Apprendre les emprunts bancaires

Application éducative 100 % frontend tirée du support « Titre 4 – Les emprunts bancaires » (Université de Rennes, p. 120 à 127).
Aucun backend, aucune API, aucune base de données : tout fonctionne dans le navigateur, y compris hors connexion.

## Contenu

- **Cours** : 4 chapitres, 12 leçons (sources de financement, définition, intérêts, paiement périodique, in fine, amortissement constant, annuité constante, comparaison, souscription, paiement, écritures).
- **Exercices** : 40 exercices sur 3 niveaux (QCM, vrai/faux, numérique, calcul, à compléter, problème, compréhension), correction détaillée.
- **Quiz** : 4 séries (44 questions), questions et options mélangées, chronomètre facultatif, historique, résultats détaillés.
- **Simulateur** : in fine, amortissement constant, annuité constante ; tableau d'amortissement, graphiques, écriture comptable de chaque échéance, comparaison de 3 scénarios, export CSV.
- **Mémo** : formules, comptes, glossaire.
- **Gamification** : XP, niveaux, 11 badges, séries, objectif du jour, défi de révision.

### Fidélité au support

Seul le contenu du PDF est enseigné. Points signalés dans l'application :

- Le support ne présente que des **échéances annuelles à taux fixe** : le simulateur se limite à ce cas.
- Les **intérêts capitalisés** (in fine), le **taux variable**, le **crédit-bail**, l'**autofinancement**, les **capitaux propres** et les **subventions** sont cités sans être détaillés.
- **Coquille p. 125** : le calcul sous le tableau oublie « 1 − » au dénominateur ; la formule p. 122 est la bonne.
- **Arrondi p. 125** : en N+5, 440,22 + 11 005,52 = 11 445,74 (et non 11 445,71). L'écart d'arrondi est reporté sur la dernière échéance.

## Commandes

| Commande | Rôle |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Lance le serveur de développement (http://localhost:5173) |
| `npm test` | Lance les 40 tests (calculs financiers, contenu, sauvegarde) |
| `npm run build` | Vérifie les types et construit le dossier `dist/` |
| `npm run preview` | Sert la version construite (http://localhost:4173) |

## Architecture

```
src/
├── assets/        styles (Tailwind v4, thème clair/sombre) et sons (mp3 intégrés)
├── components/    common, course, exercises, simulator, dashboard, gamification
├── composables/   useChart (Chart.js adapté au thème)
├── data/          chapters, lessons, formulas, examples, exercises, quizzes, glossary, badges
├── router/        Vue Router (chargement à la demande des pages)
├── services/      loan (moteur de calcul), loanCompare, gamification, storage, sound
├── stores/        Pinia : progress, settings, ui
├── types/         types TypeScript partagés
├── utils/         format (montants fr-FR), answers (lecture tolérante des réponses)
└── views/         une vue par page
tests/             tests Vitest
```

Le contenu pédagogique est séparé de l'interface (`src/data`). Chaque chapitre, leçon, exercice et question a un identifiant stable.
Pour brancher plus tard un backend (comptes, synchronisation), il suffit de remplacer `services/storage.ts`.

## Données

La progression est enregistrée dans le **localStorage** du navigateur (`echeance:progress`, `echeance:settings`).
Elle n'est **pas synchronisée** entre appareils : utilise l'export / import JSON dans Réglages pour la transférer.

## Déployer gratuitement sur Vercel

1. **Vérifier en local** : `npm install`, puis `npm test`, puis `npm run build`, puis `npm run preview`.
2. **Initialiser Git** dans le dossier du projet : `git init`, `git add .`, `git commit -m "Première version"`.
3. **Créer un dépôt GitHub** vide (sans README) sur github.com → New repository, par exemple `emprunts-app`.
4. **Envoyer le projet** : `git branch -M main`, `git remote add origin https://github.com/TON-COMPTE/emprunts-app.git`, `git push -u origin main`.
5. **Connecter Vercel** : sur vercel.com, se connecter avec GitHub → Add New → Project → importer le dépôt.
6. **Configuration du build** (détectée automatiquement) : Framework Preset `Vite`, Build Command `npm run build`, Output Directory `dist`. Aucune variable d'environnement.
7. **Deploy** : Vercel construit le projet et donne une URL publique du type `https://emprunts-app.vercel.app`.
8. **Mettre à jour** : après une modification, `git add .`, `git commit -m "Ce qui change"`, `git push`. Vercel redéploie tout seul.

Le fichier `vercel.json` redirige toutes les adresses vers `index.html`, pour que les liens directs (ex. `/cours/l-in-fine`) fonctionnent.
