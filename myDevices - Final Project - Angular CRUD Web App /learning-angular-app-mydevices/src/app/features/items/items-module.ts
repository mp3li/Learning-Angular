import { NgModule } from '@angular/core';
import { ItemsRoutingModule } from './items-routing-module';
import { Detail } from './pages/detail/detail';
import { List } from './pages/list/list';

@NgModule({
  imports: [List, Detail, ItemsRoutingModule],
})
export class ItemsModule {}
