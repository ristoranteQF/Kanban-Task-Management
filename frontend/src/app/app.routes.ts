import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./components/auth/signup/signup.component/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'boards',
    loadComponent: () => import('./components/board/board-layout/board-layout.component/board-layout.component').then(m => m.BoardLayoutComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/boards',
    pathMatch: 'full'
  }
];
