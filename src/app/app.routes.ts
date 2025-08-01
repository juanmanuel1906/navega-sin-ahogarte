import { Routes } from '@angular/router';
import { NotFound } from './routes/not-found/not-found';
import { Home } from './routes/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Navega Sin Ahogarte - Tu Bienestar Digital', 
  },
  {
    path: 'wellness-test',
    loadComponent: () => import('././features/wellness-test/wellness-test').then(m => m.WellnessTest),
    //canActivate: [authGuard], 
    title: 'Test de Bienestar Digital'
  },
  {
    path: '**',
    component: NotFound,
    title: '404 - Página no encontrada',
  },
];
