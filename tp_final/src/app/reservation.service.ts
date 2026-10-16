import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import {
  Reservation,
  RESERVATIONS_INITIALES
} from './data/donnees-initiales';

/**
 * Centralise les réservations et leur persistance.
 * Le signal permet aux pages catalogue, détail et réservations de rester
 * synchronisées après chaque ajout ou annulation.
 */
@Injectable({ providedIn: 'root' })
export class ReservationService {
  private readonly cleStockage = 'campus-material-reservations';
  private readonly platformId = inject(PLATFORM_ID);

  /** État courant des réservations de l'application. */
  readonly reservations = signal<Reservation[]>(this.chargerReservations());

  /**
   * Charge les réservations existantes côté navigateur.
   * En SSR, localStorage n'existe pas : les données initiales servent alors
   * uniquement de valeur de départ pour le rendu serveur.
   */
  private chargerReservations(): Reservation[] {
    if (!isPlatformBrowser(this.platformId)) {
      return RESERVATIONS_INITIALES.map(reservation => ({ ...reservation }));
    }

    const donnees = localStorage.getItem(this.cleStockage);
    if (!donnees) {
      return RESERVATIONS_INITIALES.map(reservation => ({ ...reservation }));
    }

    try {
      const reservations = JSON.parse(donnees) as Reservation[];
      return Array.isArray(reservations) ? reservations : [];
    } catch {
      // Une valeur corrompue ne doit pas empêcher l'application de démarrer.
      return [];
    }
  }

  /** Enregistre l'état courant uniquement dans le navigateur. */
  private sauvegarderReservations(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.cleStockage, JSON.stringify(this.reservations()));
    }
  }

  /** Indique si un équipement possède déjà une réservation active. */
  estReserve(equipementId: number): boolean {
    return this.reservations().some(reservation => reservation.equipementId === equipementId);
  }

  /**
   * Réserve un équipement pour un étudiant.
   * Le retour false signale que l'équipement était déjà réservé.
   */
  reserver(equipementId: number, etudiantId: number): boolean {
    if (this.estReserve(equipementId)) {
      return false;
    }

    const reservation: Reservation = {
      id: crypto.randomUUID(),
      equipementId,
      etudiantId
    };

    this.reservations.update(reservations => [...reservations, reservation]);
    this.sauvegarderReservations();
    return true;
  }

  /**
   * Annule une réservation uniquement si elle appartient à l'étudiant actif.
   * La suppression rend immédiatement l'équipement disponible via estReserve.
   */
  annuler(reservationId: string, etudiantId: number): boolean {
    const reservation = this.reservations().find(item => item.id === reservationId);
    if (!reservation || reservation.etudiantId !== etudiantId) {
      return false;
    }

    this.reservations.update(reservations => (
      reservations.filter(item => item.id !== reservationId)
    ));
    this.sauvegarderReservations();
    return true;
  }

  /** Retourne uniquement les réservations d'un étudiant donné. */
  reservationsDe(etudiantId: number): Reservation[] {
    return this.reservations().filter(reservation => reservation.etudiantId === etudiantId);
  }
}
