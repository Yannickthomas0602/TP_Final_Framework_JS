import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Page affichée lorsqu'un utilisateur n'a pas le rôle requis. */
@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './access-denied.html'
})
export class AccessDeniedPage {}
