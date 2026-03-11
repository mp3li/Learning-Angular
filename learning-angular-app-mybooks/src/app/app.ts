import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from './core/services/book-service';
import { map, Observable } from 'rxjs';
import { AuthService } from './core/services/auth-service';
import { AuthRole, AuthUser } from './core/models/auth.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="header-row">
          <h1>Learning Angular App - myBooks</h1>
          <p class="auth-status" *ngIf="currentUser$ | async as currentUser">
            Signed in as {{ currentUser.email }} ({{ currentUser.role }})
          </p>
        </div>

        <ul class="nav-links">
          <li><a routerLink="/home" routerLinkActive="active">Home</a></li>

          <ng-container *ngIf="isLoggedIn$ | async; else loggedOutLinks">
            <li><a routerLink="/items" routerLinkActive="active">myBooks</a></li>
            <li><a routerLink="/items/1" routerLinkActive="active">Book Details ({{ booksCount$ | async }})</a></li>
            <li><a routerLink="/items" routerLinkActive="active">API Objects</a></li>
            <li *ngIf="(role$ | async) === 'admin'">
              <a routerLink="/create-edit" routerLinkActive="active">Admin: Create Book Entry</a>
            </li>
            <li>
              <button type="button" class="logout-btn" (click)="logout()">Logout</button>
            </li>
          </ng-container>

          <ng-template #loggedOutLinks>
            <li><a routerLink="/login" routerLinkActive="active">Login</a></li>
            <li><a routerLink="/register" routerLinkActive="active">Register</a></li>
          </ng-template>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css',
})
export class App {
  booksCount$: Observable<number>;
  currentUser$: Observable<AuthUser | null>;
  isLoggedIn$: Observable<boolean>;
  role$: Observable<AuthRole | null>;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {
    this.booksCount$ = this.bookService.books$.pipe(map((books) => books.length));
    this.currentUser$ = this.authService.currentUser$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.role$ = this.authService.role$;
  }

  logout(): void {
    this.authService.logout();
  }
}
