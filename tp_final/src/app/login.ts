import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { COMPTES_INITIAUX } from './data/donnees-initiales';
import { SessionService } from './session';

/** Page de connexion de démonstration. */
@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginPage {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  protected nom = '';
  protected readonly erreur = signal('');

  /** Recherche le compte par son nom puis ouvre la session avec son rôle réel. */
  protected seConnecter(): void {
    const nom = this.nom.trim();

    if (!nom) {
      this.erreur.set('Veuillez saisir votre nom.');
      return;
    }

    // Le rôle vient des données initiales, jamais d'une saisie utilisateur.
    const compte = COMPTES_INITIAUX.find(
      compteInitial => compteInitial.nom.toLocaleLowerCase() === nom.toLocaleLowerCase()
    );

    if (!compte) {
      this.erreur.set('Ce nom ne correspond à aucun compte connu.');
      return;
    }

    this.session.connecter(compte.nom, compte.role);
    this.router.navigateByUrl('/catalogue');
  }
}
