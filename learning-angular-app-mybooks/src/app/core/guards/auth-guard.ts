import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Placeholder authentication guard
  const isAuthenticated = true; // Replace with actual auth logic
  
  if (!isAuthenticated) {
    console.log('[AuthGuard] Access denied for:', state.url);
    return false;
  }
  
  console.log('[AuthGuard] Access granted for:', state.url);
  return true;
};
