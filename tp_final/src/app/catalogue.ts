import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CATEGORIES,
  Categorie,
  EQUIPEMENTS_INITIAUX,
  Equipement
} from './data/donnees-initiales';

type FiltreDisponibilite = 'tous' | 'disponible' | 'reserve';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './catalogue.html'
})
export class CataloguePage {
  protected readonly categories = CATEGORIES;
  protected readonly recherche = signal('');
  protected readonly categorieSelectionnee = signal<Categorie | 'toutes'>('toutes');
  protected readonly disponibiliteSelectionnee = signal<FiltreDisponibilite>('tous');

  protected get equipementsFiltres(): Equipement[] {
    const recherche = this.recherche().trim().toLocaleLowerCase();
    const categorie = this.categorieSelectionnee();
    const disponibilite = this.disponibiliteSelectionnee();

    return EQUIPEMENTS_INITIAUX.filter(equipement => {
      const correspondAuNom = equipement.nom.toLocaleLowerCase().includes(recherche);
      const correspondALaCategorie = categorie === 'toutes' || equipement.categorie === categorie;
      const correspondALaDisponibilite = disponibilite === 'tous'
        || (disponibilite === 'reserve' && equipement.reserve)
        || (disponibilite === 'disponible' && !equipement.reserve);

      return correspondAuNom && correspondALaCategorie && correspondALaDisponibilite;
    });
  }

  protected setRecherche(event: Event): void {
    this.recherche.set((event.target as HTMLInputElement).value);
  }

  protected setCategorie(event: Event): void {
    this.categorieSelectionnee.set((event.target as HTMLSelectElement).value as Categorie | 'toutes');
  }

  protected setDisponibilite(event: Event): void {
    this.disponibiliteSelectionnee.set((event.target as HTMLSelectElement).value as FiltreDisponibilite);
  }
}