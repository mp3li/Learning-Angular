import { Component } from '@angular/core';
import { AppTableComponent } from '../../../../shared/components/app-table/app-table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [AppTableComponent, RouterLink],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  items = [
    { id: 1, name: 'Item 1', description: 'First sample item', status: 'Active' },
    { id: 2, name: 'Item 2', description: 'Second sample item', status: 'Active' },
    { id: 3, name: 'Item 3', description: 'Third sample item', status: 'Inactive' },
  ];
  
  headers = ['id', 'name', 'description', 'status'];
}
