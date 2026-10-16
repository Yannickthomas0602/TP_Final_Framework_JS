import { Routes } from '@angular/router';
import { PagePlaceholder } from './app';
import { AccueilPage } from './accueil';
import { CataloguePage } from './catalogue';
import { MaterielPage } from './materiel';

export const routes: Routes = [
	{ path: '', component: AccueilPage, data: { title: 'Accueil' } },
	{ path: 'login', component: PagePlaceholder, data: { title: 'Choix du compte de démonstration' } },
	{ path: 'catalogue', component: CataloguePage, data: { title: 'Liste, recherche et filtre' } },
	{ path: 'materiels/:id', component: MaterielPage, data: { title: 'Fiche détaillée et réservation' } },
	{ path: 'mes-reservations', component: PagePlaceholder, data: { title: 'Réservations personnelles' } },
	{ path: 'gestion', component: PagePlaceholder, data: { title: 'Gestion du catalogue' } },
	{ path: 'gestion/nouveau', component: PagePlaceholder, data: { title: 'Création d’un équipement' } },
	{ path: 'gestion/:id/modifier', component: PagePlaceholder, data: { title: 'Modification d’un équipement' } },
	{ path: 'acces-refuse', component: PagePlaceholder, data: { title: 'Explication d’un refus' } },
	{ path: '**', component: PagePlaceholder, data: { title: 'Page 404' } }
];
