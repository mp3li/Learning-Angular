import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { AccountPage } from './features/account/pages/account/account';
import { Home } from './features/home/pages/home/home';
import { NotFoundPage } from './features/not-found/pages/not-found/not-found';
import { ObjectDetailPage } from './features/objects/pages/detail/detail';
import { ObjectsListPage } from './features/objects/pages/list/list';
import { ObjectFormPage } from './features/objects/pages/object-form/object-form';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'account', component: AccountPage, canActivate: [authGuard] },
  { path: 'objects', component: ObjectsListPage, canActivate: [authGuard] },
  { path: 'objects/create', component: ObjectFormPage, canActivate: [authGuard] },
  { path: 'objects/:id', component: ObjectDetailPage, canActivate: [authGuard] },
  { path: 'objects/:id/edit', component: ObjectFormPage, canActivate: [authGuard] },
  { path: 'not-found', component: NotFoundPage },
  { path: '**', redirectTo: 'not-found' },
];
