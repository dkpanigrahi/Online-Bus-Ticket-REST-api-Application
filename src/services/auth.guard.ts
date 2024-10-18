import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from './authservice.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const requiredRoles = route.data['role']; // This can be an array of roles from app.routes.ts

  if (isLoggedIn) {
    const userRole = authService.getRole(); // Fetch the user's role

    // Check if userRole is in the requiredRoles array
    if (requiredRoles.includes(userRole)) {
      return true; // Allow access if the role matches any of the required roles
    } else {
      // Redirect based on user role if it doesn't match
      if (userRole === 'ROLE_ADMIN') {
        router.navigate(['/admin-home']);
      } else if (userRole === 'ROLE_USER') {
        router.navigate(['/user-home']);
      } else {
        router.navigate(['/public-home']); 
      }
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false; // Not logged in, redirect to login
  }
};
