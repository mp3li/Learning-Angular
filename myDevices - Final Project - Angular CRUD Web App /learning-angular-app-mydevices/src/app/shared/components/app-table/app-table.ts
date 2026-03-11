import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
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
          <tr *ngFor="let row of rows()" (click)="rowClick.emit(row)">
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
      background-color: #ECDFD1;
    }
    .app-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #ddd;
      background-color: #ECDFD1;
    }
    th {
      background-color: #7C5340;
      color: #fff;
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      border: 1px solid #ddd;
      padding: 12px;
      background-color: #ECDFD1;
    }
    tbody tr {
      background-color: #ECDFD1;
      cursor: pointer;
    }
    tbody tr:hover {
      background-color: #ECDFD1;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppTableComponent {
  headers = input<string[]>([]);
  rows = input<Record<string, unknown>[]>([]);
  rowClick = output<Record<string, unknown>>();
}
