import { Routes } from '@angular/router';
import { AccueilPage } from './accueil';
import { AccessDeniedPage } from './access-denied';
import { authGuard, roleGuard } from './auth.guard';
import { CataloguePage } from './catalogue';
import { GestionFormPage } from './gestion-form';
import { GestionPage } from './gestion';
import { LoginPage } from './login';
import { MaterielPage } from './materiel';
import { NotFoundPage } from './not-found';
import { ReservationsPage } from './reservations';

export const routes: Routes = [
	{ path: '', component: AccueilPage, data: { title: 'Accueil' } },
	{ path: 'login', component: LoginPage, data: { title: 'Choix du compte de démonstration' } },
	{ path: 'catalogue', component: CataloguePage, canActivate: [authGuard], data: { title: 'Liste, recherche et filtre' } },
	{ path: 'materiels/:id', component: MaterielPage, canActivate: [authGuard], data: { title: 'Fiche détaillée et réservation' } },
	{ path: 'mes-reservations', component: ReservationsPage, canActivate: [roleGuard('student')], data: { title: 'Réservations personnelles' } },
	{ path: 'gestion', component: GestionPage, canActivate: [roleGuard('manager')], data: { title: 'Gestion du catalogue' } },
	{ path: 'gestion/nouveau', component: GestionFormPage, canActivate: [roleGuard('manager')], data: { title: 'Création d’un équipement' } },
	{ path: 'gestion/:id/modifier', component: GestionFormPage, canActivate: [roleGuard('manager')], data: { title: 'Modification d’un équipement' } },
	{ path: 'acces-refuse', component: AccessDeniedPage, data: { title: 'Explication d’un refus' } },
	{ path: '**', component: NotFoundPage, data: { title: 'Page 404' } }
];
