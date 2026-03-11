import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { Detail } from './pages/detail/detail';
import { List } from './pages/list/list';

export const ITEMS_ROUTES: Routes = [
  { path: '', component: List, canActivate: [authGuard] },
  { path: ':id', component: Detail, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(ITEMS_ROUTES)],
  exports: [RouterModule],
})
export class ItemsRoutingModule {}
