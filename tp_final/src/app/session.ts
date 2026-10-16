import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Role } from './data/donnees-initiales';

export interface UtilisateurConnecte {
  id: number;
  nom: string;
  role: Role;
}

/**
 * Stocke l'utilisateur connecté pendant la durée de vie de l'application.
 * Ce service simule une session de démonstration sans authentification réelle.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly cleStockage = 'campus-material-session';
  private readonly platformId = inject(PLATFORM_ID);

  /** Recharge la session existante au démarrage de l'application. */
  readonly utilisateur = signal<UtilisateurConnecte | null>(this.chargerSession());

  private chargerSession(): UtilisateurConnecte | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const donnees = localStorage.getItem(this.cleStockage);
    if (!donnees) {
      return null;
    }

    try {
      return JSON.parse(donnees) as UtilisateurConnecte;
    } catch {
      // Une session illisible est ignorée pour permettre à l'application de démarrer.
      return null;
    }
  }

  private sauvegarderSession(utilisateur: UtilisateurConnecte): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.cleStockage, JSON.stringify(utilisateur));
    }
  }

  /** Ouvre une session avec le compte sélectionné sur la page de connexion. */
  connecter(id: number, nom: string, role: Role): void {
    const utilisateur = { id, nom: nom.trim(), role };
    this.utilisateur.set(utilisateur);
    this.sauvegarderSession(utilisateur);
  }

  /** Ferme la session courante et supprime sa persistance. */
  deconnecter(): void {
    this.utilisateur.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.cleStockage);
    }
  }
}
