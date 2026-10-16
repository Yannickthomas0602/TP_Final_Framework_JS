import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EQUIPEMENTS_INITIAUX } from './data/donnees-initiales';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './materiel.html'
})
export class MaterielPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly equipement = EQUIPEMENTS_INITIAUX.find(
    item => item.id === Number(this.route.snapshot.paramMap.get('id'))
  );
}