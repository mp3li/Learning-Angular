import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthUser } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-account',
  imports: [CommonModule, RouterLink],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountPage {
  currentUser$: Observable<AuthUser | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
