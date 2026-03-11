export type AuthRole = 'user' | 'admin';

export interface AuthTokenPayload {
  id: number;
  email: string;
  role: AuthRole;
  exp: number;
}

export interface AuthUser {
  id: number;
  email: string;
  role: AuthRole;
}

export interface AuthResult {
  success: boolean;
  message: string;
  token?: string;
}
