import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home/home';
import { List } from './features/items/pages/list/list';
import { Detail } from './features/items/pages/detail/detail';
import { CreateEdit } from './features/editor/pages/create-edit/create-edit';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'items', component: List },
  { path: 'items/:id', component: Detail, canActivate: [authGuard] },
  { path: 'create-edit', component: CreateEdit },
];
