import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';
import { CreateEdit } from './pages/create-edit/create-edit';

export const EDITOR_ROUTES: Routes = [
  {
    path: '',
    component: CreateEdit,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(EDITOR_ROUTES)],
  exports: [RouterModule],
})
export class EditorRoutingModule {}
