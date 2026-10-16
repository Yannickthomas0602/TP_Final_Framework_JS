import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, Categorie, Equipement } from './data/donnees-initiales';
import { CatalogueService } from './catalogue.service';
import { ReservationService } from './reservation.service';

type FiltreDisponibilite = 'tous' | 'disponible' | 'reserve';

// Page de gestion du catalogue réservée aux responsables.
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './gestion.html'
})
export class GestionPage {
  private readonly catalogueService = inject(CatalogueService);
  private readonly reservationService = inject(ReservationService);

  protected readonly message = signal('');
  protected readonly categories = CATEGORIES;
  protected readonly recherche = signal('');
  protected readonly categorieSelectionnee = signal<Categorie | 'toutes'>('toutes');
  protected readonly disponibiliteSelectionnee = signal<FiltreDisponibilite>('tous');

  // Reprend les filtres du catalogue sur le catalogue complet du responsable,
  // sans modifier les données persistées.
  protected get equipements(): Equipement[] {
    // Les signaux contiennent les valeurs saisies dans les contrôles de la page.
    const recherche = this.recherche().trim().toLocaleLowerCase();
    const categorie = this.categorieSelectionnee();
    const disponibilite = this.disponibiliteSelectionnee();

    return this.catalogueService.equipements().map(equipement => ({
      // L'état est recalculé depuis les réservations actives, pas depuis la copie initiale.
      ...equipement,
      reserve: this.reservationService.estReserve(equipement.id)
    })).filter(equipement => {
      // Un équipement doit satisfaire simultanément la recherche et les deux filtres.
      const correspondAuNom = equipement.nom.toLocaleLowerCase().includes(recherche);
      const correspondALaCategorie = categorie === 'toutes' || equipement.categorie === categorie;
      const correspondALaDisponibilite = disponibilite === 'tous'
        || (disponibilite === 'reserve' && equipement.reserve)
        || (disponibilite === 'disponible' && !equipement.reserve);

      return correspondAuNom && correspondALaCategorie && correspondALaDisponibilite;
    });
  }

  protected setRecherche(event: Event): void {
    // Le cast donne accès à la valeur du champ texte qui a déclenché l'événement.
    this.recherche.set((event.target as HTMLInputElement).value);
  }

  protected setCategorie(event: Event): void {
    // La valeur du select est reconvertie vers l'union de catégories attendue.
    this.categorieSelectionnee.set((event.target as HTMLSelectElement).value as Categorie | 'toutes');
  }

  protected setDisponibilite(event: Event): void {
    // Le filtre est mis à jour sans modifier les équipements sauvegardés.
    this.disponibiliteSelectionnee.set((event.target as HTMLSelectElement).value as FiltreDisponibilite);
  }

  // Demande une confirmation avant suppression.
  // Le service refuse ensuite toute suppression d'un équipement réservé.
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
