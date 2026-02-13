import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { loggingInterceptor } from '@shared/interceptors/logging.interceptor';
import { authInterceptor } from '@auth/interceptors/auth.interceptor';
import { sanitizationInterceptor } from '@shared/interceptors/sanitization.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()), // Para el despliegue.
    provideHttpClient(  // permite realizar peticiones asyncronas hacia el servidor.
      withFetch(),
      withInterceptors([
        sanitizationInterceptor, // Sanitiza inputs para prevenir XSS
        loggingInterceptor,      // Loggea peticiones HTTP
        authInterceptor          // Inyecta JWT token
      ])
    ),
  ]
};
