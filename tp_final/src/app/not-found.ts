import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Page affichée lorsqu'aucune route ne correspond à l'URL demandée.
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.html'
})
export class NotFoundPage {}
