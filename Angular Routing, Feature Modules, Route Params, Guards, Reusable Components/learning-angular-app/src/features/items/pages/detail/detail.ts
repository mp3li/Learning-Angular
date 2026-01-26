import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  template: '<h1>Detail Page for Item {{id()}}</h1>',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent {
  id = input<string>('');

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      console.log('Item ID:', params.get('id'));
    });
  }
}
