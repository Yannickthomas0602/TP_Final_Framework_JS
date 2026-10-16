import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { COMPTES_INITIAUX, Role } from './data/donnees-initiales';
import { SessionService } from './session';

/** Page de connexion de démonstration. */
@Component({
  standalone: true,
  imports: [],
  templateUrl: './login.html'
})
export class LoginPage {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  /** Comptes proposés pour la connexion de démonstration. */
  protected readonly comptes = COMPTES_INITIAUX;

  /** Connecte le compte sélectionné et ouvre le catalogue. */
  protected seConnecter(id: number, nom: string, role: Role): void {
    this.session.connecter(id, nom, role);
    this.router.navigateByUrl('/catalogue');
  }

  /** Traduit le rôle technique en libellé lisible dans le bouton. */
  protected libelleRole(role: Role): string {
    return role === 'manager' ? 'Responsable' : 'Étudiant';
  }
}
