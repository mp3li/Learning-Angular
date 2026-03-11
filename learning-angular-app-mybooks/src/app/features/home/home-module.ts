import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing-module';
import { Home } from './pages/home/home';

@NgModule({
  imports: [Home, HomeRoutingModule],
})
export class HomeModule {}
