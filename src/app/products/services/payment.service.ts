import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { PaymentRequest, PaymentResponse, PaymentStatus } from '@shared/interfaces/payment.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  paymentStatus = signal<PaymentStatus>(PaymentStatus.IDLE);
  lastTransaction = signal<PaymentResponse | null>(null);

  /**
   * Procesa el pago (simulado)
   * En producción, esto llamaría a una API de pago real (Stripe, PayPal, etc.)
   */
  processPayment(paymentRequest: PaymentRequest): Observable<PaymentResponse> {
    this.paymentStatus.set(PaymentStatus.PROCESSING);

    // Simulación de procesamiento de pago
    const isSuccess = Math.random() > 0.1; // 90% success rate para demo

    if (isSuccess) {
      const response: PaymentResponse = {
        success: true,
        transactionId: this.generateTransactionId(),
        message: 'Pago procesado exitosamente',
        timestamp: new Date()
      };

      return of(response).pipe(
        delay(2000), // Simula latencia de red
      );
    } else {
      return throwError(() => ({
        success: false,
        message: 'Error al procesar el pago. Por favor, intente nuevamente.',
        timestamp: new Date()
      })).pipe(delay(2000));
    }
  }

  /**
   * Genera un ID de transacción único
   */
  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Resetea el estado del pago
   */
  resetPaymentStatus(): void {
    this.paymentStatus.set(PaymentStatus.IDLE);
    this.lastTransaction.set(null);
  }
}
