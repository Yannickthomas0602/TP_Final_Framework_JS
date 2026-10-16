import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Equipement, Reservation } from './data/donnees-initiales';
import { CatalogueService } from './catalogue.service';
import { ReservationService } from './reservation.service';
import { SessionService } from './session';

// Page des réservations personnelles, réservée aux étudiants connectés.
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reservations.html'
})
export class ReservationsPage {
  private readonly session = inject(SessionService);
  private readonly catalogueService = inject(CatalogueService);
  private readonly reservationService = inject(ReservationService);

  // Ne conserve que les réservations dont etudiantId correspond au compte actif.
  protected get reservations(): Reservation[] {
    const utilisateur = this.session.utilisateur();
    return utilisateur
      ? this.reservationService.reservationsDe(utilisateur.id)
      : [];
  }

  // Retrouve le matériel associé à une réservation pour l'afficher.
  protected equipement(reservation: Reservation): Equipement | undefined {
    return this.catalogueService.trouver(reservation.equipementId);
  }

  // Annule une réservation appartenant à l'étudiant actuellement connecté.
  protected annulerReservation(reservationId: string): void {
    const utilisateur = this.session.utilisateur();
    if (utilisateur) {
      this.reservationService.annuler(reservationId, utilisateur.id);
    }
  }
}