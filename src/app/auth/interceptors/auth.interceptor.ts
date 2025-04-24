import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';
import { Observable } from 'rxjs';


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authToken = inject(AuthService).token();
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${authToken}`)
  });

  return next(newReq);
}

