import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard').then(m => m.Dashboard),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
]
