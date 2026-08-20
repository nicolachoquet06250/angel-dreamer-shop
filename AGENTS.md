# AGENTS.md

## Projet

Angel Dreamer est une boutique e-commerce Nuxt 4 / Vue 3 / TypeScript, servie en production par Nitro en mode `node-server`.

Le code vise Node.js 22+ et utilise :

- Nuxt 4, Vue 3 et TypeScript strict ;
- Nitro pour les routes et middlewares serveur ;
- Drizzle ORM avec SQLite en développement et MySQL en production ;
- Vitest avec `jsdom`, Testing Library Vue et couverture V8 ;
- Stripe, PayPal et Nodemailer côté serveur ;
- un déploiement GitHub Actions vers Alwaysdata.

## Structure utile

- `app.vue` : shell principal de l'application.
- `pages/` : routes Nuxt publiques, compte client, panier, commande et admin.
- `components/` : composants Vue réutilisables, notamment catalogue, header, carrousel et éditeurs admin.
- `composables/` : logique Vue côté client.
- `server/api/` : endpoints Nitro.
- `server/routes/` : routes techniques comme `robots.txt`, `sitemap.xml` et `llms.txt`.
- `server/middleware/` : middlewares Nitro, notamment sécurité et bootstrap admin.
- `server/utils/` : logique serveur partagée, auth, checkout, base de données, images et SEO/LLM.
- `db/schema.ts` : schéma SQLite.
- `db/schema.mysql.ts` : schéma MySQL.
- `drizzle/` et `drizzle-mysql/` : migrations générées.
- `tests/` : tests unitaires et tests de routes.
- `assets/css/*.module.css` : styles encapsulés par CSS Modules.
- `scripts/fix-coverage-links.mjs` : normalisation des liens du rapport de couverture.

## Commandes

Utiliser `npm` et conserver `package-lock.json`.

```bash
npm install --no-audit --no-fund
npm run dev
npm run build
npm run test
npm run test:coverage
npm run db:generate
npm run db:migrate
```

Avant de livrer une modification applicative, exécuter au minimum `npm run test`. Pour une modification qui touche Nuxt, Nitro, les imports auto-générés ou la configuration, exécuter aussi `npm run build`. Pour une modification couverte par la CI, préférer `npm run build && npm run test:coverage`.

## Environnement

Copier `.env.example` vers `.env` en local. Ne jamais commiter de secret réel.

Variables importantes :

- `NUXT_DATABASE_DRIVER=sqlite` en développement ;
- `NUXT_DATABASE_PATH=./db/angel-dreamer.sqlite` ou autre fichier SQLite local ;
- `NUXT_DATABASE_DRIVER=mysql` en production ;
- `NUXT_MYSQL_URL=...` en production ;
- secrets JWT, SMTP, Stripe et PayPal via `.env`.

Le script `start` lance `node --env-file=.env .output/server/index.mjs`; garder cette hypothèse compatible avec Alwaysdata.

## Base de données

Le choix du schéma Drizzle dépend de `NUXT_DATABASE_DRIVER`.

- SQLite : `db/schema.ts`, migrations dans `drizzle/`.
- MySQL : `db/schema.mysql.ts`, migrations dans `drizzle-mysql/`.

Quand une table ou colonne change, mettre à jour le ou les schémas concernés et générer les migrations correspondantes. Ne pas éditer une migration déjà appliquée sans raison explicite ; créer une nouvelle migration.

## Tests et couverture

Vitest utilise `tests/setup.ts`, `jsdom`, des mocks réinitialisés entre tests et des seuils élevés :

- lignes, fonctions, statements : 95 % ;
- branches : 90 %.

Ajouter ou ajuster les tests quand une modification touche :

- l'authentification ou les rôles ;
- checkout Stripe/PayPal ;
- routes Nitro publiques ou admin ;
- sécurité, headers, cookies ou secrets ;
- rendu des composants couverts ;
- génération SEO, `robots.txt`, `sitemap.xml` ou `llms.txt`.

Le rapport de couverture est corrigé par `scripts/fix-coverage-links.mjs`. Ne pas supprimer cette étape sans adapter le workflow CI.

## CI et déploiement

Le workflow `.github/workflows/test-build-deploy.yml` s'exécute sur `main` sauf changements limités à `README.md`, `AGENTS.md` ou `.junie/guidelines.md`.

Pipeline :

1. tests : `npm run build && npm run test:coverage`, publication forcée de la branche `test-coverage`, puis échec si la suite a échoué ;
2. build : build production et artefact `.output` + manifests npm ;
3. migrate : création d'un `.env` de production depuis `PRODUCTION_ENV_FILE`, puis `npm run db:migrate` ;
4. deploy : copie SCP vers Alwaysdata, `npm ci --omit=dev`, redémarrage via API Alwaysdata.

Préserver les secrets GitHub Actions et ne pas les remplacer par des valeurs en dur.

## Style de code

- Respecter le style existant : TypeScript ESM, imports explicites, indentation locale et composants Vue SFC.
- Garder `typescript.strict` activé.
- Préférer des fonctions petites et testables dans `server/utils/` pour la logique serveur partagée.
- Préférer les composables pour la logique Vue côté client.
- Garder les styles de composants dans les CSS Modules existants quand c'est cohérent.
- Éviter les abstractions nouvelles si elles ne réduisent pas clairement la complexité.
- Ne pas mélanger logique serveur sensible et code client.

## Sécurité

Traiter l'e-commerce, l'authentification et les paiements comme des zones sensibles.

- Ne jamais exposer les secrets runtime au client ; seules les clés sous `runtimeConfig.public` peuvent être publiques.
- Valider les entrées de routes API.
- Préserver les headers de sécurité définis dans `nuxt.config.ts` et les middlewares serveur.
- Garder les cookies, tokens JWT, rôles admin/client et webhooks de paiement couverts par des tests.
- Ne pas affaiblir la Content Security Policy sans justification précise.

## Frontend

L'interface est une boutique responsive avec thème clair/sombre.

- Vérifier les états mobile et desktop pour les pages touchées.
- Préserver l'accessibilité basique : labels de formulaire, boutons explicites, contrastes lisibles et navigation clavier raisonnable.
- Éviter les textes qui débordent dans les cartes, boutons, en-têtes et formulaires.
- Utiliser les assets existants dans `assets/` et `public/` avant d'en ajouter.

## Règles d'intervention

- Lire les fichiers concernés avant modification.
- Limiter les changements au besoin réel de la tâche.
- Ne pas modifier `.env` avec des secrets réels.
- Ne pas supprimer `package-lock.json`.
- Ignorer les dossiers générés comme `.nuxt/`, `.output/`, `coverage/` et `node_modules/` sauf demande explicite.
- Signaler les tests non exécutés ou les validations impossibles.
