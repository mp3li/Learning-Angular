import { Routes } from '@angular/router';
import { HomeComponent } from '../features/home';
import { ListComponent, DetailComponent } from '../features/items';
import { CreateEditComponent } from '../features/editor';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'items', component: ListComponent },
  { path: 'items/:id', component: DetailComponent, canActivate: [authGuard] },
  { path: 'create-edit', component: CreateEditComponent, canActivate: [authGuard, roleGuard] },
];
