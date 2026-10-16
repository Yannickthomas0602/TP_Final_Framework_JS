import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EQUIPEMENTS_INITIAUX } from './data/donnees-initiales';

/** Page de détail d'un équipement sélectionné dans le catalogue. */
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './materiel.html'
})
export class MaterielPage {
  private readonly route = inject(ActivatedRoute);

  /**
   * Recherche l'équipement correspondant à l'identifiant de la route.
   * La valeur est undefined si l'identifiant ne correspond à aucun équipement;
   * le template affiche alors le message « Matériel introuvable ».
   */
  protected readonly equipement = EQUIPEMENTS_INITIAUX.find(
    // Les paramètres d'URL sont textuels : conversion en nombre avant comparaison avec id.
    item => item.id === Number(this.route.snapshot.paramMap.get('id'))
  );
}