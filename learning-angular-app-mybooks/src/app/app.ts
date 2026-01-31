import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from './core/services/book-service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <h1>Learning Angular App - myBooks</h1>
        <ul class="nav-links">
          <li><a routerLink="/home" routerLinkActive="active">Home</a></li>
          <li><a routerLink="/items" routerLinkActive="active">myBooks</a></li>
          <li><a routerLink="/items/1" routerLinkActive="active">Book Details ({{ booksCount$ | async }})</a></li>
          <li><a routerLink="/create-edit" routerLinkActive="active">Create Book Entry</a></li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {
  booksCount$: Observable<number>;

  constructor(private bookService: BookService) {
    this.booksCount$ = this.bookService.books$.pipe(map(books => books.length));
  }
}
