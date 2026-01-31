import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  // Placeholder role-based guard
  const userRole = 'admin'; // Replace with actual role logic
  const requiredRoles = route.data['roles'] as string[] || ['admin'];
  
  if (!requiredRoles.includes(userRole)) {
    console.log('[RoleGuard] Insufficient role for:', state.url);
    return false;
  }
  
  console.log('[RoleGuard] Role check passed for:', state.url);
  return true;
};
