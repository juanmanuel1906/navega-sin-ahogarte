import { Routes } from '@angular/router';
import { Intranet } from './intranet';
import { Dashboard } from './dashboard/dashboard';
import { Analytics } from './analytics/analytics';
import { Users } from './users/users';
import { AnonymousPostAdmin } from './anonymous-post-admin/anonymous-post-admin';
import { authGuard } from '../auth/guards/auth-guard';
import { WellnessTestPanel } from './wellness-test-panel/wellness-test-panel';

export const IntranetRoutes: Routes = [
  {
    path: '',
    component: Intranet,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        title: "Tablero"
      },
      {
        path: 'analytics',
        component: Analytics,
        title: "Analíticas"
      },
      {
        path: 'users',
        component: Users,
        title: "Usuarios"
      },
      {
        path: 'anonymous-post-admin',
        component: AnonymousPostAdmin,
        title: "Comunidad anónimos"
      },
      {
        path: 'wellness-test-panel',
        component: WellnessTestPanel,
        title: "Comunidad anónimos"
      },
    ],
  },
];
