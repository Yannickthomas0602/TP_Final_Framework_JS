import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CATEGORIES, Categorie } from './data/donnees-initiales';
import { CatalogueService, DonneesEquipement } from './catalogue.service';

// Formulaire responsable de création et de modification d'un équipement.
@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './gestion-form.html'
})
export class GestionFormPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogueService = inject(CatalogueService);

  protected readonly categories = CATEGORIES;
  protected readonly erreur = signal('');
  protected readonly id = Number(this.route.snapshot.paramMap.get('id'));
  protected readonly modification = Number.isInteger(this.id) && this.id > 0;

  protected nom = '';
  protected categorie: Categorie | '' = '';
  protected description = '';
  protected localisation = '';

  constructor() {
    // En modification, les valeurs existantes préremplissent le formulaire.
    if (this.modification) {
      const equipement = this.catalogueService.trouver(this.id);
      if (equipement) {
        this.nom = equipement.nom;
        this.categorie = equipement.categorie;
        this.description = equipement.description;
        this.localisation = equipement.localisation;
      }
    }
  }

  // Valide les champs puis ajoute ou modifie l'équipement persistant.
  protected enregistrer(formulaire: NgForm): void {
    // On nettoie les champs texte avant de construire l'objet envoyé au service.
    const donnees: DonneesEquipement = {
      nom: this.nom.trim(),
      categorie: this.categorie as Categorie,
      description: this.description.trim(),
      localisation: this.localisation.trim()
    };

    // Un équipement incomplet n'est ni créé ni enregistré.
    if (formulaire.invalid || !donnees.nom || !donnees.localisation) {
      formulaire.form.markAllAsTouched();
      this.erreur.set('Les champs nom, catégorie et localisation doivent contenir des informations.');
      return;
    }

    // Le même formulaire sert aux deux routes : création ou modification.
    if (this.modification) {
      this.catalogueService.modifier(this.id, donnees);
    } else {
      this.catalogueService.ajouter(donnees);
    }

    this.router.navigateByUrl('/gestion');
  }
}
