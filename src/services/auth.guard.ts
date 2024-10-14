import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from './authservice.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const requiredRole = route.data['role'];//REQURIED ROLE GETTING FROM APP.ROUTE.TS

  if (isLoggedIn) {
    const userRole = authService.getRole();//FETCH USER ROLE
    if (userRole === requiredRole) {
      return true; // Allow access if the role matches
    } else {
      // Redirect based on user role
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
    return false; 
  }
};

