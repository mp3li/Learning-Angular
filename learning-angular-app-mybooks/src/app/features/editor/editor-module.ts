import { NgModule } from '@angular/core';
import { EditorRoutingModule } from './editor-routing-module';
import { CreateEdit } from './pages/create-edit/create-edit';

@NgModule({
  imports: [CreateEdit, EditorRoutingModule],
})
export class EditorModule {}
