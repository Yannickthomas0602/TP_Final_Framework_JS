import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogueService } from './catalogue.service';
import { ReservationService } from './reservation.service';

/** Page de gestion du catalogue réservée aux responsables. */
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gestion.html'
})
export class GestionPage {
  private readonly catalogueService = inject(CatalogueService);
  private readonly reservationService = inject(ReservationService);

  protected readonly message = signal('');

  /** Ajoute l'état réel de réservation à chaque ligne de la liste. */
  protected get equipements() {
    return this.catalogueService.equipements().map(equipement => ({
      ...equipement,
      reserve: this.reservationService.estReserve(equipement.id)
    }));
  }

  /**
   * Demande une confirmation avant suppression.
   * Le service refuse ensuite toute suppression d'un équipement réservé.
   */
  protected supprimer(id: number): void {
    const equipement = this.catalogueService.trouver(id);
    if (!equipement || !window.confirm(`Supprimer « ${equipement.nom} » ?`)) {
      return;
    }

    if (!this.catalogueService.supprimer(id)) {
      this.message.set('Cet équipement est réservé et ne peut pas être supprimé.');
      return;
    }

    this.message.set('L’équipement a été supprimé.');
  }
}
