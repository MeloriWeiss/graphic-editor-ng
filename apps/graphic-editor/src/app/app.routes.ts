import { Routes } from '@angular/router';
import {
  canActivateAuth,
  canActivateNonAuth,
  LoginPageComponent,
  SignupPageComponent,
} from '@ge/auth';
import { AuthLayoutComponent } from '@ge/layout/auth';
import { BaseLayoutComponent } from '@ge/layout/base';
import { ErrorComponent } from '@ge/common-ui';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BaseLayoutComponent,
        children: [
          {
            path: '',
            redirectTo: 'profile/me',
            pathMatch: 'full',
          },
          {
            path: 'profile/:id',
            loadChildren: () => import('@ge/profile').then((m) => m.profileRoutes),
          },
          {
            path: 'forum',
            loadChildren: () => import('@ge/forum').then((m) => m.forumRoutes),
          },
          {
            path: 'mods',
            loadChildren: () => import('@ge/mods').then((m) => m.modsRoutes),
          },
        ]
      },
      {
        path: 'workshop',
        loadComponent: () => import('@ge/workshop').then((m) => m.WorkshopPageComponent)
      },
    ],
    canActivate: [canActivateAuth],
    title: 'Maps of the world',
  },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
        title: 'Maps of the world: Вход',
      },
      {
        path: 'signup',
        component: SignupPageComponent,
        title: 'Maps of the world: Регистрация',
      },
    ],
    canActivate: [canActivateNonAuth],
  },

  {
    path: '**',
    component: ErrorComponent,
  },
];
