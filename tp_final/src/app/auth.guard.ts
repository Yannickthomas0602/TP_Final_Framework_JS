import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from './data/donnees-initiales';
import { SessionService } from './session';

// Autorise l'accès aux pages réservées aux utilisateurs connectés.
// Une session absente renvoie directement vers la page de connexion.
export const authGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.utilisateur() ? true : router.parseUrl('/login');
};

// Crée un guard réservé à un rôle précis.
// Un utilisateur non connecté doit d'abord passer par /login;
// un utilisateur connecté avec un autre rôle est envoyé vers /acces-refuse.
export function roleGuard(roleRequis: Role): CanActivateFn {
  return () => {
    const session = inject(SessionService);
    const router = inject(Router);
    const utilisateur = session.utilisateur();

    if (!utilisateur) {
      return router.parseUrl('/login');
    }

    return utilisateur.role === roleRequis
      ? true
      : router.parseUrl('/acces-refuse');
  };
}
