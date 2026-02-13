import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

/**
 * Guard mejorado con validación de roles y redirección
 * Previene acceso no autorizado al panel de administración
 */
export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    // Verifica el estado de autenticación
    await firstValueFrom(authService.checkStatus());

    const isAuthenticated = authService.authStatus() === 'authenticated';
    const isAdmin = authService.isAdmin();

    // Validación estricta: debe estar autenticado Y ser admin
    if (!isAuthenticated) {
      console.warn('🔒 Acceso denegado: Usuario no autenticado');
      router.navigate(['/auth/login']);
      return false;
    }

    if (!isAdmin) {
      console.warn('🔒 Acceso denegado: Usuario sin privilegios de administrador');
      router.navigate(['/']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error en IsAdminGuard:', error);
    router.navigate(['/auth/login']);
    return false;
  }
}
