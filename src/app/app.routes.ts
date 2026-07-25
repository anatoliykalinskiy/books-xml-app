import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const authService = inject(AuthService); const router = inject(Router);
  return authService.isAuthenticated() ? true : router.parseUrl('/login');
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      }
    ]
  },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
