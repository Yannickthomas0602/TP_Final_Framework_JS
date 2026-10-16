# Campus Material

Application Angular de consultation et de réservation de matériel du campus.

## Installation et lancement du serveur

### Prérequis

- Node.js installé, version compatible avec Angular 21.
- npm installé avec Node.js.
- Git installé pour cloner le dépôt.

Vérifier les installations :

```bash
node --version
npm --version
git --version
```

### Récupérer le projet

Cloner le dépôt depuis GitHub puis entrer dans le dossier du projet :

```bash
git clone https://github.com/Yannickthomas0602/TP_Final_Framework_JS.git
cd TP_Final_Framework_JS/tp_final
```

### Installer les dépendances

Depuis le dossier `tp_final` :

```bash
npm install
```

### Lancer le serveur de développement

```bash
npm start
```

Cette commande exécute `ng serve`. Le serveur surveille les modifications et reconstruit automatiquement l'application.

L'application est disponible à l'adresse `http://localhost:4200/`.

Pour arrêter le serveur, utiliser `Ctrl+C` dans le terminal.

La commande Angular équivalente est :

```bash
npx ng serve
```

### Lancer le serveur SSR compilé

Pour lancer la version compilée avec le serveur Angular/Express :

```bash
npm run build
npm run serve:ssr:tp_final
```

Le serveur SSR est alors disponible par défaut à l'adresse `http://localhost:4000/`.

Pour vérifier la compilation de production :

```bash
npm run build
```

## Organisation du projet

Le projet est une application Angular standalone. Les fichiers sont séparés entre les points d'entrée de l'application, les composants de l'interface, les services métier et les données initiales.

```text
tp_final/
├── angular.json              # Configuration Angular
├── package.json              # Dépendances et scripts npm
├── tsconfig*.json            # Configuration TypeScript
├── public/                   # Fichiers statiques publics
└── src/
	├── index.html            # Document HTML racine
	├── main.ts               # Démarrage côté navigateur
	├── main.server.ts        # Démarrage côté serveur
	├── server.ts             # Serveur SSR Express
	├── styles.css            # Styles globaux et thème du site
	└── app/
		├── app.ts            # Composant racine et navigation persistante
		├── app.html          # Barre de navigation et router-outlet
		├── app.routes.ts     # Routes Angular et règles d'accès
		├── app.config.ts     # Configuration Angular côté navigateur
		├── app.config.server.ts
		├── app.routes.server.ts
		├── app.spec.ts       # Tests du composant racine
		│
		├── accueil.ts / accueil.html
		├── login.ts / login.html
		├── catalogue.ts / catalogue.html
		├── materiel.ts / materiel.html
		├── reservations.ts / reservations.html
		├── gestion.ts / gestion.html
		├── gestion-form.ts / gestion-form.html
		├── access-denied.ts / access-denied.html
		├── not-found.ts / not-found.html
		│
		├── session.ts             # Session utilisateur et persistance
		├── catalogue.service.ts   # Catalogue et opérations CRUD
		├── reservation.service.ts # Réservations et disponibilité
		├── auth.guard.ts          # Contrôle de connexion et de rôle
		└── data/
			└── donnees-initiales.ts # Comptes, catégories et équipements initiaux
```

## Comptes de démonstration

La connexion se fait en sélectionnant un bouton de compte. Le rôle est lu depuis `COMPTES_INITIAUX`.

| Nom | Rôle |
| --- | --- |
| Alice Martin | Étudiant |
| Yanis Bernard | Étudiant |
| Camille Dupont | Responsable |

La session est conservée dans `localStorage` jusqu'à ce que l'utilisateur clique sur **Se déconnecter**.

## Routes et accès

| Route | Contenu | Accès |
| --- | --- | --- |
| `/` | Page d'accueil | Public |
| `/login` | Choix du compte de démonstration | Public |
| `/catalogue` | Liste, recherche et filtres du catalogue | Utilisateur connecté |
| `/materiels/:id` | Fiche détaillée et réservation | Utilisateur connecté |
| `/mes-reservations` | Réservations personnelles | Étudiant |
| `/gestion` | Gestion du catalogue et des réservations | Responsable |
| `/gestion/nouveau` | Création d'un équipement | Responsable |
| `/gestion/:id/modifier` | Modification d'un équipement | Responsable |
| `/acces-refuse` | Explication d'un refus d'accès | Public |
| Toute route inconnue | Page 404 | Public |

Un utilisateur non connecté qui tente d'accéder à une route protégée est redirigé vers `/login`.
Un utilisateur connecté avec un rôle insuffisant est redirigé vers `/acces-refuse`.

## Fonctionnalités

- Recherche d'un équipement par nom.
- Filtrage par catégorie et disponibilité.
- Consultation des fiches matériel.
- Réservation d'un équipement disponible par un étudiant.
- Annulation d'une réservation depuis **Mes réservations**.
- Gestion responsable : ajout, modification et suppression avec confirmation.
- Suppression impossible pour un équipement déjà réservé.
- Persistance du catalogue et des réservations dans `localStorage`.
- Persistance de la session utilisateur dans `localStorage`.

## Explications techniques

### Composants

| Composant | Responsabilité |
| --- | --- |
| `App` | Composant racine : conserve la barre de navigation et le `router-outlet`. Il affiche les liens selon le rôle connecté et gère la déconnexion. |
| `AccueilPage` | Affiche la page d'accueil à la racine `/`. |
| `LoginPage` | Affiche les trois comptes de démonstration. Le clic transmet l'identifiant, le nom et le rôle au service de session. |
| `CataloguePage` | Affiche les équipements, la recherche et les filtres de catégorie/disponibilité. Il utilise l'état courant du catalogue et des réservations. |
| `MaterielPage` | Récupère l'identifiant `:id` dans l'URL, affiche la fiche complète et permet à un étudiant de réserver un équipement disponible. |
| `ReservationsPage` | Filtre les réservations avec l'identifiant de l'étudiant connecté et permet leur annulation. |
| `GestionPage` | Liste les équipements pour le responsable et propose la modification ou la suppression après confirmation. |
| `GestionFormPage` | Utilise le même formulaire pour créer ou modifier une fiche matériel selon la présence d'un identifiant dans l'URL. |
| `AccessDeniedPage` | Explique qu'un utilisateur connecté ne possède pas le rôle requis. |
| `NotFoundPage` | Affiche une page 404 pour toute route inconnue. |

### Services

#### `SessionService`

Ce service conserve l'utilisateur connecté dans un `signal`. Il stocke son identifiant, son nom et son rôle dans `localStorage` afin que la session survive à une actualisation. La clé est supprimée uniquement lors de la déconnexion.

#### `CatalogueService`

Ce service est la source unique du catalogue modifiable. Il charge les équipements depuis `localStorage` ou copie `EQUIPEMENTS_INITIAUX` au premier lancement. Il fournit les opérations d'ajout, de modification et de suppression. Une suppression est refusée si l'équipement est réservé.

#### `ReservationService`

Ce service gère les réservations dans un `signal` et les persiste dans `localStorage`. Il empêche la réservation d'un équipement déjà réservé, vérifie qu'un étudiant annule uniquement ses propres réservations et permet de recalculer immédiatement la disponibilité.

### Guards et navigation

`authGuard` vérifie qu'une session existe avant d'autoriser le catalogue ou une fiche matériel. `roleGuard` vérifie ensuite le rôle requis pour les pages étudiant ou responsable. Un visiteur est redirigé vers `/login`, tandis qu'un utilisateur connecté mais non autorisé est redirigé vers `/acces-refuse`.

### Réactivité Angular

Les `signal` stockent les états modifiables : session, catalogue, réservations et filtres. Les templates Angular relisent automatiquement ces valeurs après une réservation, une annulation, une modification ou une déconnexion, sans rechargement manuel de la page.

## Vérifications réalisées

Les vérifications suivantes ont été effectuées manuellement dans l'application :

- Une route inconnue affiche la page 404.
- Un utilisateur sans le rôle requis affiche la page 403 « Accès refusé ».
- Une réservation reste présente après actualisation de la page.
- L'annulation d'une réservation la supprime de la liste et rend l'équipement disponible.
- Une session reste active après actualisation.
- La déconnexion supprime la session et renvoie vers `/login`.

## Scénario de parcours utilisateur

1. Un étudiant ouvre l'application et accède à la page de connexion.
2. Il sélectionne le compte **Alice Martin** pour ouvrir une session.
3. Depuis le catalogue, il recherche un matériel, applique éventuellement un filtre et ouvre sa fiche détaillée.
4. Il réserve le matériel s'il est disponible, puis vérifie sa réservation dans **Mes réservations**.
5. Il peut annuler la réservation depuis cette page. Le matériel redevient alors disponible dans le catalogue.
6. Lorsqu'il se déconnecte, il est redirigé vers la page de connexion.

Le responsable suit un parcours similaire pour se connecter, puis accède à **Gestion** afin d'ajouter, modifier ou supprimer un matériel. La suppression d'un matériel déjà réservé est refusée.