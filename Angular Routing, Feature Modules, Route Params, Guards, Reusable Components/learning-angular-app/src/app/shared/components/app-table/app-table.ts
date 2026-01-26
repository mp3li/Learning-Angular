import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <table class="app-table">
        <thead>
          <tr>
            <th *ngFor="let header of headers()">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows()">
            <td *ngFor="let header of headers()">{{ row[header] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-wrapper {
      overflow-x: auto;
      margin: 16px 0;
    }
    .app-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #ddd;
    }
    th {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      border: 1px solid #ddd;
      padding: 12px;
    }
    tr:hover {
      background-color: #f9f9f9;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTableComponent {
  headers = input<string[]>([]);
  rows = input<Record<string, unknown>[]>([]);
}
