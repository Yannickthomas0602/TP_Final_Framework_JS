import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CATEGORIES,
  Categorie,
  Equipement
} from './data/donnees-initiales';
import { CatalogueService } from './catalogue.service';
import { ReservationService } from './reservation.service';

type FiltreDisponibilite = 'tous' | 'disponible' | 'reserve';

// Page principale du catalogue.
// Les équipements sont lus depuis les données initiales et peuvent être
// filtrés localement sans modifier le tableau source.
@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './catalogue.html'
})
export class CataloguePage {
  private readonly catalogueService = inject(CatalogueService);
  private readonly reservationService = inject(ReservationService);

  protected readonly categories = CATEGORIES;

  // Valeurs saisies par la personne
  protected readonly recherche = signal('');
  protected readonly categorieSelectionnee = signal<Categorie | 'toutes'>('toutes');
  protected readonly disponibiliteSelectionnee = signal<FiltreDisponibilite>('tous');


//    Retourne les équipements qui correspondent aux trois critères actifs.
//    Les critères vides ou positionnés sur « tous » ne restreignent pas la liste.
     protected get equipementsFiltres(): Equipement[] {
    // La recherche est normalisée pour accepter les majuscules et les espaces inutiles.
    const recherche = this.recherche().trim().toLocaleLowerCase();
    const categorie = this.categorieSelectionnee();
    const disponibilite = this.disponibiliteSelectionnee();

    // On reconstruit l'état reserve depuis le service plutôt que depuis la
    // constante initiale, car les réservations peuvent avoir changé.
    return this.catalogueService.equipements().map(equipement => ({
      ...equipement,
      reserve: this.reservationService.estReserve(equipement.id)
    })).filter(equipement => {
      // Chaque équipement doit respecter simultanément les trois critères actifs.
      const correspondAuNom = equipement.nom.toLocaleLowerCase().includes(recherche);
      const correspondALaCategorie = categorie === 'toutes' || equipement.categorie === categorie;
      const correspondALaDisponibilite = disponibilite === 'tous'
        || (disponibilite === 'reserve' && equipement.reserve)
        || (disponibilite === 'disponible' && !equipement.reserve);

      return correspondAuNom && correspondALaCategorie && correspondALaDisponibilite;
    });
  }

  //Met à jour la recherche à partir du champ texte
  protected setRecherche(event: Event): void {
    this.recherche.set((event.target as HTMLInputElement).value);
  }

  // Met à jour la catégorie sélectionnée dans le menu déroulant
  protected setCategorie(event: Event): void {
    this.categorieSelectionnee.set((event.target as HTMLSelectElement).value as Categorie | 'toutes');
  }

  // Met à jour le filtre de disponibilité dans le menu déroulant
  protected setDisponibilite(event: Event): void {
    this.disponibiliteSelectionnee.set((event.target as HTMLSelectElement).value as FiltreDisponibilite);
  }
}