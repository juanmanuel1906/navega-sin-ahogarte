// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Un guardia funcional que comprueba si el usuario tiene un token.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el método hasToken() que definimos en tu AuthService
  if (authService.hasToken()) {
    // Si tiene token, permite el acceso
    return true; 
  }

  // Si NO tiene token:
  // 1. Redirige a la página de login
  router.navigate(['/auth']);
  
  // 2. Bloquea el acceso a la ruta solicitada
  return false;
};