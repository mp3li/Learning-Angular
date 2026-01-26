import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  imports: [FormsModule],
  template: `
    <div class="form-field">
      <label [for]="id()">{{ label() }}</label>
      <input 
        [id]="id()"
        [type]="type()"
        [value]="value()"
        (change)="valueChanged.emit($event.target.value)"
        [placeholder]="placeholder()"
        class="form-control"
      />
    </div>
  `,
  styles: [`
    .form-field {
      margin: 12px 0;
      display: flex;
      flex-direction: column;
    }
    label {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .form-control {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppFormFieldComponent {
  label = input<string>('Field Label');
  type = input<string>('text');
  id = input<string>('field');
  value = input<string>('');
  placeholder = input<string>('');
  valueChanged = output<string>();
}
