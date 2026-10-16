import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import {
  EQUIPEMENTS_INITIAUX,
  Equipement
} from './data/donnees-initiales';
import { ReservationService } from './reservation.service';

export type DonneesEquipement = Omit<Equipement, 'id' | 'reserve'>;

// Centralise le catalogue modifiable par le responsable.
// Les équipements sont persistés séparément des réservations dans localStorage.
@Injectable({ providedIn: 'root' })
export class CatalogueService {
  private readonly cleStockage = 'campus-material-equipements';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly reservationService = inject(ReservationService);

  // État courant du catalogue partagé par toutes les pages.
  readonly equipements = signal<Equipement[]>(this.chargerEquipements());

  // Charge le catalogue sauvegardé ou crée une copie des données initiales.
  private chargerEquipements(): Equipement[] {
    // Le serveur ne peut pas accéder à localStorage : il utilise une copie isolée
    // des données initiales pour éviter toute modification du tableau source.
    if (!isPlatformBrowser(this.platformId)) {
      return EQUIPEMENTS_INITIAUX.map(equipement => ({ ...equipement }));
    }

    const donnees = localStorage.getItem(this.cleStockage);
    // L'absence de clé correspond au premier lancement de l'application.
    if (!donnees) {
      return EQUIPEMENTS_INITIAUX.map(equipement => ({ ...equipement }));
    }

    try {
      const equipements = JSON.parse(donnees) as Equipement[];
      // On ne réutilise le contenu sauvegardé que s'il possède bien une forme de tableau.
      return Array.isArray(equipements) ? equipements : [];
    } catch {
      // Des données JSON invalides ne doivent pas bloquer l'accès au catalogue.
      return EQUIPEMENTS_INITIAUX.map(equipement => ({ ...equipement }));
    }
  }

  // Sauvegarde le catalogue uniquement côté navigateur.
  private sauvegarder(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.cleStockage, JSON.stringify(this.equipements()));
    }
  }

  // Retourne un équipement par son identifiant.
  trouver(id: number): Equipement | undefined {
    return this.equipements().find(equipement => equipement.id === id);
  }

  // Retourne l'état réel, calculé à partir des réservations actives.
  estReserve(id: number): boolean {
    return this.reservationService.estReserve(id);
  }

  // Ajoute un équipement avec un identifiant supérieur aux identifiants existants.
  ajouter(donnees: DonneesEquipement): Equipement {
    // Le nouvel identifiant reste unique même si des équipements ont été supprimés.
    const prochainId = Math.max(0, ...this.equipements().map(equipement => equipement.id)) + 1;
    const equipement: Equipement = { ...donnees, id: prochainId, reserve: false };
    this.equipements.update(equipements => [...equipements, equipement]);
    this.sauvegarder();
    return equipement;
  }

  // Modifie les caractéristiques d'un équipement existant.
  modifier(id: number, donnees: DonneesEquipement): boolean {
    // Une URL ou un formulaire peut contenir un identifiant inexistant.
    if (!this.trouver(id)) {
      return false;
    }

    // La réservation n'est jamais modifiée par le formulaire responsable.
    this.equipements.update(equipements => equipements.map(equipement => (
      equipement.id === id
        ? { ...donnees, id, reserve: this.estReserve(id) }
        : equipement
    )));
    this.sauvegarder();
    return true;
  }

  // Supprime un équipement uniquement s'il existe et n'est pas réservé.
  // Le responsable reçoit false lorsqu'une réservation bloque la suppression.
  supprimer(id: number): boolean {
    // Les deux conditions protègent l'opération même si le bouton HTML est contourné.
    if (!this.trouver(id) || this.estReserve(id)) {
      return false;
    }

    this.equipements.update(equipements => (
      equipements.filter(equipement => equipement.id !== id)
    ));
    this.sauvegarder();
    return true;
  }
}
