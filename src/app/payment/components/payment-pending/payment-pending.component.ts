import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-pending',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <div class="mx-auto w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-500">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Pago Pendiente</h1>
        <p class="text-gray-400 mb-8">El pago está siendo procesado. Te notificaremos cuando se confirme.</p>

        <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <p class="text-sm text-gray-400 mb-2">ID de Pago</p>
          <p class="text-yellow-400 font-mono text-lg">{{ paymentId }}</p>
          <p class="text-sm text-gray-400 mt-4 mb-2">Estado</p>
          <span class="badge badge-warning badge-lg gap-2">{{ status }}</span>
        </div>

        <a routerLink="/catalog" class="btn btn-primary btn-lg gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Seguir Comprando
        </a>
      </div>
    </div>
  `,
})
export class PaymentPendingComponent {
  private route = inject(ActivatedRoute);

  paymentId = this.route.snapshot.queryParams['payment_id'] ?? '—';
  status = this.route.snapshot.queryParams['status'] ?? 'in_process';
}
