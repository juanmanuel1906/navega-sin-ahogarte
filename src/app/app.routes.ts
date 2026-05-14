import { Routes } from '@angular/router';
import { NotFound } from './routes/not-found/not-found';
import { Home } from './routes/home/home';
import { Auth } from './features/auth/auth';
import { publicGuard } from './features/auth/guards/public-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Navega Sin Ahogarte - Tu Bienestar Digital',
  },
  {
    path: 'auth',
    component: Auth,
    title: 'NSA - Autenticación',
    canActivate: [publicGuard]
  },
  {
    path: 'wellness-test',
    loadComponent: () =>
      import('./././features/components/wellness-test/wellness-test').then(
        (m) => m.WellnessTest
      ),
    //canActivate: [authGuard],
    title: 'NSA - Test de Bienestar Digital',
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/intranet/intranet.routes').then((i) => i.IntranetRoutes),
  },
  {
    path: '**',
    component: NotFound,
    title: '404 - Página no encontrada',
  },
];
