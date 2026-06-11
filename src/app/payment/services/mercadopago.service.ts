import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {
  CreatePreferenceRequest,
  CreatePreferenceResponse,
} from 'src/app/payment/interfaces/mercadopago.interface';

@Injectable({ providedIn: 'root' })
export class MercadoPagoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/payments`;

  createPreference(
    request: CreatePreferenceRequest,
  ): Observable<CreatePreferenceResponse> {
    return this.http
      .post<CreatePreferenceResponse>(
        `${this.apiUrl}/create-preference`,
        request,
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error('[MercadoPago] Error creating preference:', err);
          return throwError(
            () => new Error(err.error?.message ?? 'Error al crear la preferencia de pago'),
          );
        }),
      );
  }
}
