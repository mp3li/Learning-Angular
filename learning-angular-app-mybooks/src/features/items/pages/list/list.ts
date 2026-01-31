import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-list',
  template: '<h1>Items List</h1>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {}
