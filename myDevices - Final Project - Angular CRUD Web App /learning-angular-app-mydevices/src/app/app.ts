import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUser } from './core/models/auth.model';
import { AuthService } from './core/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="navbar">
      <div class="nav-container">
        <div class="header-row">
          <h1>myDevices</h1>
          <p class="auth-status" *ngIf="currentUser$ | async as currentUser">
            Signed in as {{ currentUser.email }} ({{ currentUser.role }})
          </p>
        </div>

        <nav>
          <ul class="nav-links">
            <li><a routerLink="/home" routerLinkActive="active">Home</a></li>

            <ng-container *ngIf="isLoggedIn$ | async; else loggedOutLinks">
              <li><a routerLink="/objects" routerLinkActive="active">Objects</a></li>
              <li><a routerLink="/objects/create" routerLinkActive="active">Create</a></li>
              <li><a routerLink="/account" routerLinkActive="active">Account</a></li>
              <li>
                <button type="button" class="logout-btn" (click)="logout()">Logout</button>
              </li>
            </ng-container>

            <ng-template #loggedOutLinks>
              <li><a routerLink="/login" routerLinkActive="active">Login</a></li>
              <li><a routerLink="/register" routerLinkActive="active">Register</a></li>
            </ng-template>
          </ul>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.css',
})
export class App {
  currentUser$: Observable<AuthUser | null>;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout(): void {
    this.authService.logout();
  }
}
