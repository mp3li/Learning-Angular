import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AuthResult, AuthRole, AuthTokenPayload } from '../models/auth.model';

interface MockUserRecord {
  id: number;
  email: string;
  passwordHash: string;
  role: AuthRole;
}

@Injectable({ providedIn: 'root' })
export class MockAuthApiService {
  private users: MockUserRecord[] = [
    {
      id: 1,
      email: 'admin@mybooks.app',
      passwordHash: this.hashPassword('Admin123!'),
      role: 'admin',
    },
  ];

  register(email: string, password: string): Observable<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = this.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      return of({ success: false, message: 'An account with that email already exists.' }).pipe(delay(300));
    }

    const nextId = this.users.length === 0 ? 1 : Math.max(...this.users.map((user) => user.id)) + 1;
    const role: AuthRole = normalizedEmail === 'admin@mybooks.app' ? 'admin' : 'user';

    this.users.push({
      id: nextId,
      email: normalizedEmail,
      passwordHash: this.hashPassword(password),
      role,
    });

    return of({ success: true, message: 'Registration successful.' }).pipe(delay(300));
  }

  login(email: string, password: string): Observable<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find((item) => item.email === normalizedEmail);

    if (!user) {
      return of({ success: false, message: 'No account found for that email.' }).pipe(delay(300));
    }

    if (user.passwordHash !== this.hashPassword(password)) {
      return of({ success: false, message: 'Incorrect email or password.' }).pipe(delay(300));
    }

    const token = this.createMockToken({
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    });

    return of({ success: true, message: 'Login successful.', token }).pipe(delay(300));
  }

  private hashPassword(rawPassword: string): string {
    // Deterministic mock hash for assignment purposes only.
    const input = `mybooks::${rawPassword}::jwt`;
    let hash = 0;

    for (let index = 0; index < input.length; index += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(index);
      hash |= 0;
    }

    return `h${Math.abs(hash).toString(16)}`;
  }

  private createMockToken(payload: AuthTokenPayload): string {
    const encodedPayload = btoa(JSON.stringify(payload));
    return `mock-header.${encodedPayload}.mock-signature`;
  }
}
