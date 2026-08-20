# Angel Dreamer

Boutique e-commerce Nuxt 4 / Vue 3 / TypeScript exécutable sur tout serveur Node.js 22+.

## Fonctions

- catalogue, comptes et commandes stockés dans un fichier SQLite persistant ;
- authentification JWT et rôles administrateur/client gérés par l’application ;
- paiement Stripe Checkout ou PayPal Checkout ;
- styles encapsulés dans un CSS Module ;
- thème clair/sombre et responsive.

Copier `.env.example` vers `.env`, définir un secret JWT et les accès SMTP/paiement, puis lancer `npm run build` et `npm start`. Montez le dossier `data/` sur un volume persistant en production.
# Bases de données

L’application utilise SQLite par défaut en développement :

```env
NUXT_DATABASE_DRIVER=sqlite
NUXT_DATABASE_PATH=./data/angel-dreamer.sqlite
```

En production, utilisez MySQL :

```env
NUXT_DATABASE_DRIVER=mysql
NUXT_MYSQL_URL=mysql://utilisateur:mot_de_passe@hote:3306/base
```

Le schéma Drizzle approprié est sélectionné automatiquement par `NUXT_DATABASE_DRIVER`.

## Déploiement GitHub Actions vers Alwaysdata

Le workflow `.github/workflows/test-build-deploy.yml` nécessite les secrets suivants :

- `ALWAYSDATA_SSH_HOST`
- `ALWAYSDATA_SSH_PORT`
- `ALWAYSDATA_SSH_USER`
- `ALWAYSDATA_SSH_PASSWORD`
- `ALWAYSDATA_DEPLOY_PATH` : chemin absolu du projet sur le serveur
- `ALWAYSDATA_API_KEY`
- `ALWAYSDATA_ACCOUNT`
- `ALWAYSDATA_SITE_ID`
- `PRODUCTION_ENV_FILE` : contenu complet du fichier `.env` de production

Le site Alwaysdata doit lancer l’application depuis `ALWAYSDATA_DEPLOY_PATH` avec la commande `npm start`. Le script `start` utilise le fichier `.env` déployé et démarre `.output/server/index.mjs`.
