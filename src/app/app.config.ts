import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { loggingInterceptor } from '@shared/interceptors/logging.interceptor';
import { authInterceptor } from '@auth/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(  // permite realizar peticiones asyncronas hacia el servidor.
      withFetch(),
      withInterceptors([
        // interceptors para loggear las peticiones https.
        loggingInterceptor,
        authInterceptor
      ])
    ),
  ]
};
