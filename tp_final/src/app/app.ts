import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SessionService } from './session';


@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  /** Session partagée avec la page de connexion. */
  protected readonly session = inject(SessionService);

  /** Contrôle l'affichage du bouton de déconnexion au clic. */
  protected readonly menuOuvert = signal(false);

  private readonly router = inject(Router);

  /** Inverse l'état du menu affiché sous le profil connecté. */
  protected basculerMenu(): void {
    this.menuOuvert.update(ouvert => !ouvert);
  }

  /** Ferme la session, masque le menu et renvoie vers /login. */
  protected seDeconnecter(): void {
    this.session.deconnecter();
    this.menuOuvert.set(false);
    this.router.navigateByUrl('/login');
  }
}


@Component({
  standalone: true,
  imports: [],
  template: ''
})
export class PagePlaceholder {}
