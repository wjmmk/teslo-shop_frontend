import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <div class="mx-auto w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-500">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Pago Rechazado</h1>
        <p class="text-gray-400 mb-8">No se pudo procesar el pago. Verifica tus datos e intenta nuevamente.</p>

        <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <p class="text-sm text-gray-400 mb-2">ID de Pago</p>
          <p class="text-red-400 font-mono text-lg">{{ paymentId }}</p>
          <p class="text-sm text-gray-400 mt-4 mb-2">Estado</p>
          <span class="badge badge-error badge-lg gap-2">{{ status }}</span>
        </div>

        <div class="flex gap-4 justify-center">
          <a routerLink="/payment" class="btn btn-primary btn-lg gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Reintentar
          </a>
          <a routerLink="/catalog" class="btn btn-outline btn-lg gap-3">
            Seguir Comprando
          </a>
        </div>
      </div>
    </div>
  `,
})
export class PaymentFailureComponent {
  private route = inject(ActivatedRoute);

  paymentId = this.route.snapshot.queryParams['payment_id'] ?? '—';
  status = this.route.snapshot.queryParams['status'] ?? 'rejected';
}
