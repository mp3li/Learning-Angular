import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-field">
      <label [for]="id()">{{ label() }}</label>
      <input
        [id]="id()"
        [type]="type()"
        [formControl]="control()"
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
  placeholder = input<string>('');
  control = input<any>();
}
