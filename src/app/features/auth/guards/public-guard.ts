// src/app/auth/public.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Este guard previene que un usuario logueado acceda a 
 * rutas como /login o /register.
 */
export const publicGuard: CanActivateFn = (route, state) => {
  
  // Inyecta los servicios que necesitas
  const authService = inject(AuthService);
  const router = inject(Router);

  // Revisa si el usuario YA tiene un token
  if (authService.hasToken()) {
    
    // Si está logueado, redirige al Dashboard
    router.navigate(['/dashboard']); 
    
    // Bloquea el acceso a la ruta (ej. /login)
    return false; 
  }

  // Si no está logueado, permite el acceso
  return true;
};