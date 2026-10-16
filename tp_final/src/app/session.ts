import { Injectable, signal } from '@angular/core';
import { Role } from './data/donnees-initiales';

export interface UtilisateurConnecte {
  nom: string;
  role: Role;
}

/**
 * Stocke l'utilisateur connecté pendant la durée de vie de l'application.
 * Ce service simule une session de démonstration sans authentification réelle.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly utilisateur = signal<UtilisateurConnecte | null>(null);

  /** Ouvre une session avec le nom et le rôle saisis sur la page de connexion. */
  connecter(nom: string, role: Role): void {
    this.utilisateur.set({ nom: nom.trim(), role });
  }

  /** Ferme la session courante. */
  deconnecter(): void {
    this.utilisateur.set(null);
  }
}
