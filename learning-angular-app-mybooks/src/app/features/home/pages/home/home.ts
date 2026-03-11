import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCardComponent } from '../../../../shared/components/app-card/app-card';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { map, Observable } from 'rxjs';
import { AuthUser } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-home',
  imports: [AppCardComponent, RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  currentUser$: Observable<AuthUser | null>;
  isAdmin$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAdmin$ = this.authService.role$.pipe(map((role) => role === 'admin'));
  }
}
