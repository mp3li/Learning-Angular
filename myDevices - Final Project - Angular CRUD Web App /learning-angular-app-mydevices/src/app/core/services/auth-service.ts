import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AuthResult, AuthRole, AuthTokenPayload, AuthUser } from '../models/auth.model';
import { MockAuthApiService } from './mock-auth-api-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenStorageKey = 'mydevices_auth_token';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.readUserFromToken(this.getToken()));

  readonly currentUser$ = this.currentUserSubject.asObservable();
  readonly isLoggedIn$ = this.currentUser$.pipe(map((user) => user !== null));
  readonly role$ = this.currentUser$.pipe(map((user) => user?.role ?? null));

  constructor(
    private mockAuthApiService: MockAuthApiService,
    private router: Router
  ) {}

  register(email: string, password: string): Observable<AuthResult> {
    return this.mockAuthApiService.register(email, password);
  }

  login(email: string, password: string): Observable<AuthResult> {
    return this.mockAuthApiService.login(email, password).pipe(
      tap((result) => {
        if (result.success && result.token) {
          localStorage.setItem(this.tokenStorageKey, result.token);
          this.currentUserSubject.next(this.readUserFromToken(result.token));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.decodeToken(token);
    if (!payload) {
      this.clearInvalidSession();
      return false;
    }

    const isExpired = payload.exp <= Math.floor(Date.now() / 1000);
    if (isExpired) {
      this.clearInvalidSession();
      return false;
    }

    return true;
  }

  getRole(): AuthRole | null {
    if (!this.isLoggedIn()) {
      return null;
    }

    return this.decodeToken(this.getToken() ?? '')?.role ?? null;
  }

  private readUserFromToken(token: string | null): AuthUser | null {
    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);
    if (!payload || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }

  private decodeToken(token: string): AuthTokenPayload | null {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    try {
      const decodedPayload = atob(parts[1]);
      const parsed = JSON.parse(decodedPayload) as Partial<AuthTokenPayload>;

      if (
        typeof parsed.id !== 'number' ||
        typeof parsed.email !== 'string' ||
        (parsed.role !== 'user' && parsed.role !== 'admin') ||
        typeof parsed.exp !== 'number'
      ) {
        return null;
      }

      return parsed as AuthTokenPayload;
    } catch {
      return null;
    }
  }

  private clearInvalidSession(): void {
    localStorage.removeItem(this.tokenStorageKey);
    this.currentUserSubject.next(null);
  }
}
