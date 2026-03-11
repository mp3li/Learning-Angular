import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <h3>{{ title() }}</h3>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 16px;
      margin: 8px 0;
      background-color: #ECDFD1;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h3 {
      margin: 0 0 8px 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppCardComponent {
  title = input<string>('Card Title');
}
