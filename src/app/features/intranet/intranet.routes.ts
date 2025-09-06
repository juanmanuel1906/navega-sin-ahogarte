import { Routes } from '@angular/router';
import { Intranet } from './intranet';
import { Dashboard } from './dashboard/dashboard';
import { Analytics } from './analytics/analytics';
import { Users } from './users/users';
import { AnonymousChatAdmin } from './anonymous-chat-admin/anonymous-chat-admin';

export const IntranetRoutes: Routes = [
  {
    path: '',
    component: Intranet,
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
        path: 'anonymous-chat-admin',
        component: AnonymousChatAdmin,
        title: "Ansiosos anónimos"
      },
    ],
  },
];
