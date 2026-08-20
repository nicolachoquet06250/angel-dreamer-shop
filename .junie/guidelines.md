# Guidelines Junie

## Contexte projet

Tu travailles sur Angel Dreamer, une boutique e-commerce Nuxt 4 / Vue 3 / TypeScript strict, déployée comme serveur Node.js 22+ via Nitro `node-server`.

Stack principale :

- Nuxt 4, Vue 3, TypeScript ESM ;
- Nitro pour `server/api`, `server/routes` et `server/middleware` ;
- Drizzle ORM avec SQLite en développement et MySQL en production ;
- Vitest, `jsdom`, Testing Library Vue et couverture V8 ;
- Stripe, PayPal et Nodemailer côté serveur ;
- GitHub Actions vers Alwaysdata.

## Orientation rapide

- `app.vue` contient le shell global.
- `pages/` contient les routes Nuxt.
- `components/` contient les composants Vue réutilisables.
- `composables/` contient la logique client Vue.
- `server/api/` contient les endpoints Nitro.
- `server/routes/` contient `robots.txt`, `sitemap.xml`, `llms.txt`.
- `server/middleware/` contient les middlewares sécurité et bootstrap admin.
- `server/utils/` contient l'auth, le checkout, la DB, les images et la génération SEO/LLM.
- `db/schema.ts` est le schéma SQLite.
- `db/schema.mysql.ts` est le schéma MySQL.
- `drizzle/` et `drizzle-mysql/` contiennent les migrations.
- `tests/` contient les tests unitaires et de routes.
- `assets/css/*.module.css` contient les CSS Modules.

## Workflow Junie

Avant de modifier :

- lis les fichiers directement concernés ;
- vérifie les usages existants avant de renommer une API, une prop, une route ou une colonne ;
- garde la modification minimale et alignée avec les conventions locales ;
- évite les changements dans les fichiers générés.

Pendant la modification :

- conserve TypeScript strict ;
- garde la logique sensible côté serveur ;
- préfère `server/utils/` pour la logique serveur partagée ;
- préfère `composables/` pour la logique client Vue ;
- utilise les CSS Modules existants quand la modification est visuelle ;
- ne crée une abstraction que si elle simplifie vraiment le code.

Après la modification :

- lance les tests pertinents ;
- signale clairement les validations non exécutées ;
- ne masque pas un échec de build, de test ou de migration.

## Commandes de référence

Utilise `npm` et conserve `package-lock.json`.

```bash
npm install --no-audit --no-fund
npm run dev
npm run build
npm run test
npm run test:coverage
npm run db:generate
npm run db:migrate
```

Validation attendue :

- changement applicatif simple : `npm run test` ;
- changement Nuxt/Nitro/config/imports : `npm run build` en plus ;
- changement proche de la CI : `npm run build && npm run test:coverage`.

## Environnement

Le développement local part de `.env.example` vers `.env`. Ne jamais écrire ou commiter de secret réel.

Variables structurantes :

- `NUXT_DATABASE_DRIVER=sqlite` en local ;
- `NUXT_DATABASE_PATH=./db/angel-dreamer.sqlite` ou autre fichier local ;
- `NUXT_DATABASE_DRIVER=mysql` en production ;
- `NUXT_MYSQL_URL=...` en production ;
- secrets JWT, SMTP, Stripe et PayPal dans `.env`.

Le script de production est `npm start`, qui exécute `node --env-file=.env .output/server/index.mjs`. Préserve cette compatibilité Alwaysdata.

## Base de données

Drizzle choisit le schéma selon `NUXT_DATABASE_DRIVER`.

- SQLite : `db/schema.ts` et migrations `drizzle/`.
- MySQL : `db/schema.mysql.ts` et migrations `drizzle-mysql/`.

Si le modèle change, mets à jour le schéma concerné et génère une migration. N'édite pas une migration déjà appliquée sans demande explicite.

## Tests et couverture

Vitest utilise `tests/setup.ts`, `jsdom`, des mocks restaurés entre tests et ces seuils :

- lignes, fonctions, statements : 95 % ;
- branches : 90 %.

Ajoute ou adapte les tests pour toute modification qui touche :

- auth, JWT, rôles admin/client ;
- checkout Stripe/PayPal et webhooks ;
- routes Nitro publiques ou admin ;
- headers de sécurité, cookies, secrets ;
- composants déjà couverts ;
- SEO, `robots.txt`, `sitemap.xml`, `llms.txt`.

Le script `scripts/fix-coverage-links.mjs` fait partie du flux de couverture et de CI.

## CI et Alwaysdata

Le workflow `.github/workflows/test-build-deploy.yml` ignore les changements limités à `README.md`, `AGENTS.md` et `.junie/guidelines.md`.

Pipeline :

1. tests : `npm run build && npm run test:coverage`, publication de la branche `test-coverage`, puis échec si nécessaire ;
2. build : artefact production avec `.output`, `package.json`, `package-lock.json` ;
3. migrate : `.env` production depuis `PRODUCTION_ENV_FILE`, puis `npm run db:migrate` ;
4. deploy : SCP vers Alwaysdata, `npm ci --omit=dev`, redémarrage via API Alwaysdata.

Ne mets jamais les secrets GitHub Actions ou Alwaysdata en dur.

## Sécurité

Ce projet manipule comptes, commandes et paiements.

- N'expose pas les secrets runtime au client.
- Seules les valeurs sous `runtimeConfig.public` peuvent être publiques.
- Valide les entrées des endpoints API.
- Préserve la Content Security Policy et les headers de sécurité de `nuxt.config.ts`.
- Garde les cookies, JWT, rôles et webhooks couverts par des tests.

## Interface

L'application est une boutique responsive avec thème clair/sombre.

- Vérifie mobile et desktop pour les vues touchées.
- Préserve labels, boutons explicites, contrastes lisibles et navigation clavier raisonnable.
- Évite tout débordement de texte dans les boutons, cartes, formulaires et headers.
- Réutilise les assets de `assets/` et `public/` avant d'en ajouter.

## Fichiers à ne pas toucher sans raison explicite

- `.env` et secrets locaux ;
- `package-lock.json`, sauf changement réel de dépendances ;
- `.nuxt/`, `.output/`, `coverage/`, `node_modules/` ;
- migrations existantes déjà appliquées ;
- configuration de déploiement et secrets du workflow.

## Réponse attendue de Junie

Quand tu termines une tâche, résume :

- les fichiers modifiés ;
- les validations exécutées ;
- les risques restants ou tests non lancés.
