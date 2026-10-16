import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogueService } from './catalogue.service';
import { ReservationService } from './reservation.service';
import { SessionService } from './session';

/** Page de détail d'un équipement sélectionné dans le catalogue. */
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './materiel.html'
})
export class MaterielPage {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogueService = inject(CatalogueService);
  private readonly session = inject(SessionService);
  private readonly reservationService = inject(ReservationService);

  protected readonly message = signal('');

  /**
   * Recherche l'équipement correspondant à l'identifiant de la route.
   * La valeur est undefined si l'identifiant ne correspond à aucun équipement;
   * le template affiche alors le message « Matériel introuvable ».
   */
  protected readonly equipement = this.catalogueService.trouver(
    // Les paramètres d'URL sont textuels : conversion en nombre avant recherche.
    Number(this.route.snapshot.paramMap.get('id'))
  );

  /** Lit l'état réel depuis les réservations persistées. */
  protected estReserve(): boolean {
    return this.equipement
      ? this.reservationService.estReserve(this.equipement.id)
      : false;
  }

  /** Seuls les étudiants connectés peuvent réserver un équipement disponible. */
  protected peutReserver(): boolean {
    return this.session.utilisateur()?.role === 'student' && !this.estReserve();
  }

  /** Crée la réservation et met à jour immédiatement le signal partagé. */
  protected reserver(): void {
    const utilisateur = this.session.utilisateur();
    if (!this.equipement || !utilisateur || utilisateur.role !== 'student') {
      return;
    }

    const reservationCreee = this.reservationService.reserver(
      this.equipement.id,
      utilisateur.id
    );
    this.message.set(reservationCreee
      ? 'La réservation a été créée.'
      : 'Ce matériel vient déjà d’être réservé.');
  }
}