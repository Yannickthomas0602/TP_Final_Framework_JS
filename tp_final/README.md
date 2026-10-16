# Campus Material

Application Angular de consultation et de réservation de matériel du campus.

## Installation

Cloner le dépôt depuis GitHub puis entrer dans le dossier du projet :

```bash
git clone https://github.com/Yannickthomas0602/TP_Final_Framework_JS.git
cd TP_Final_Framework_JS/tp_final
```

Depuis le dossier `tp_final` :

```bash
npm install
```

## Lancement

```bash
npm start
```

L'application est ensuite disponible à l'adresse `http://localhost:4200/`.

Pour vérifier la compilation de production :

```bash
npm run build
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
- La compilation Angular réussit avec `npm run build`.