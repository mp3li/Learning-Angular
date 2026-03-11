import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const HOME_ROUTES: Routes = [{ path: '', component: Home }];

@NgModule({
  imports: [RouterModule.forChild(HOME_ROUTES)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
