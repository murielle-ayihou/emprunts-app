# Cursus — Réviser autrement

Application éducative 100 % frontend, pensée pour plusieurs matières. Première matière : **Comptabilité financière** (L3 MIAGE, Université de Rennes).
Aucun backend, aucune API, aucune base de données : tout fonctionne dans le navigateur, y compris hors connexion.

## Contenu (Comptabilité financière)

| Titre | Contenu | Sources |
|---|---|---|
| 1. Introduction à la comptabilité | Définition, fonctions, normes, plan de comptes, partie double, journal, comptes, balance, bilan, compte de résultat | PPT Titre 1, correction des exercices |
| 2. Opérations courantes d’exploitation | TVA (mécanisme, taux, régimes, liquidation 658/758, crédit), factures, avoirs, acomptes, règlements, paie | PPT Titre 2 (TVA, personnel), TD 1, correction exercice 6 |
| 3. Les immobilisations | Définition, coût d’acquisition, amortissement linéaire et par unités d’œuvre, dépréciation, cession | PPT Titre 3, TD 4 |
| 4. Les emprunts bancaires | Intérêts, in fine, amortissement constant, annuité constante, périodicité (taux équivalent), frais, écritures | PPT Titre 4, correction des exercices, TD 5 |

- **40 leçons**, avec schémas interactifs, formules (KaTeX), exemples pas à pas et vérifications rapides.
- **84 exercices** (dont ceux des TD, source indiquée), **7 séries de quiz**.
- **Le labo** : simulateurs Emprunt (avec vue 3D du tableau d’amortissement), TVA, Immobilisation, Paie.
- **Révision flash** : fiches vocabulaire et formules qui se retournent en 3D.
- Gamification : XP, niveaux, 13 badges, séries, objectif du jour.

### Fidélité aux supports

Seul le contenu des fichiers fournis est enseigné. Points signalés dans l’application :

- Les diapositives 52 à 83 du Titre 2 (achats et ventes, crédits et règlements) ne sont pas fournies : ce chapitre s’appuie uniquement sur le TD 1 et sa correction.
- Les énoncés des exercices du Titre 1 ne sont pas fournis : ils sont reconstitués à partir de la correction.
- Coquilles relevées : formule p. 125 (« 1 − » manquant), écart d’arrondi en N+5 (Titre 4) ; colonne « Trimestrialité » du TD 5 ; dates 30/09 au lieu du 20/09 (exercices du Titre 4) ; base 42 000 au lieu de 37 000 et libellés (TD 4) ; libellé de dotation diapositive 118.

## Commandes

| Commande | Rôle |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Lance le serveur de développement (http://localhost:5173) |
| `npm test` | Lance les tests (moteurs de calcul vérifiés sur les cours et corrections, contenu, sauvegarde) |
| `npm run build` | Vérifie les types et construit le dossier `dist/` |
| `npm run preview` | Sert la version construite (http://localhost:4173) |

## Architecture

```
src/
├── assets/        styles (Tailwind v4, thème clair/sombre) et sons (mp3 intégrés)
├── components/    common, course, exercises, simulator, dashboard, gamification
├── composables/   useChart (Chart.js adapté au thème)
├── data/          catalogue (chapters.ts : matières, Titres, chapitres) et agrégateurs
│   └── compta/    t1, t2, t3, t4 : contenu de chaque Titre
├── router/        Vue Router (chargement à la demande des pages)
├── components/three/  scènes 3D (Three.js, chargées à la demande)
├── services/      loan, tva, immo, paie (moteurs de calcul), loanCompare, gamification, storage, sound
├── stores/        Pinia : progress, settings, ui
├── types/         types TypeScript partagés
├── utils/         format (montants fr-FR), answers (lecture tolérante des réponses)
└── views/         une vue par page
tests/             tests Vitest
```

Le contenu pédagogique est séparé de l'interface (`src/data`). Chaque chapitre, leçon, exercice et question a un identifiant stable.

**Ajouter une matière** : créer `src/data/<matiere>/…` avec le même format que `compta/t1/content.ts`, puis l'ajouter dans `subjects` et `parts` (`src/data/chapters.ts`) et dans les agrégateurs.

Pour brancher plus tard un backend (comptes, synchronisation), il suffit de remplacer `services/storage.ts`.

## Données

La progression est enregistrée dans le **localStorage** du navigateur (`cursus:progress`, `cursus:settings`). La progression de l’ancienne version « Échéance » est reprise automatiquement.
Elle n'est **pas synchronisée** entre appareils : utilise l'export / import JSON dans Réglages pour la transférer.

## Déployer gratuitement sur Vercel

1. **Vérifier en local** : `npm install`, puis `npm test`, puis `npm run build`, puis `npm run preview`.
2. **Initialiser Git** dans le dossier du projet : `git init`, `git add .`, `git commit -m "Première version"`.
3. **Créer un dépôt GitHub** vide (sans README) sur github.com → New repository, par exemple `cursus`.
4. **Envoyer le projet** : `git branch -M main`, `git remote add origin https://github.com/TON-COMPTE/cursus.git`, `git push -u origin main`.
5. **Connecter Vercel** : sur vercel.com, se connecter avec GitHub → Add New → Project → importer le dépôt.
6. **Configuration du build** (détectée automatiquement) : Framework Preset `Vite`, Build Command `npm run build`, Output Directory `dist`. Aucune variable d'environnement.
7. **Deploy** : Vercel construit le projet et donne une URL publique du type `https://emprunts-app.vercel.app`.
8. **Mettre à jour** : après une modification, `git add .`, `git commit -m "Ce qui change"`, `git push`. Vercel redéploie tout seul.

Le fichier `vercel.json` redirige toutes les adresses vers `index.html`, pour que les liens directs (ex. `/cours/l-in-fine`) fonctionnent.
