import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsCartService } from '@products/services/products-cart.service';

@Component({
  selector: 'app-payment-success',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-md w-full text-center">
        <div class="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500 animate-bounce">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">¡Pago Exitoso!</h1>
        <p class="text-gray-400 mb-8">Tu pedido ha sido procesado correctamente. Recibirás un correo con los detalles.</p>

        <div class="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <p class="text-sm text-gray-400 mb-2">ID de Pago</p>
          <p class="text-green-400 font-mono text-lg">{{ paymentId }}</p>
          <p class="text-sm text-gray-400 mt-4 mb-2">Estado</p>
          <span class="badge badge-success badge-lg gap-2">
            <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            {{ status }}
          </span>
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
export class PaymentSuccessComponent {
  private route = inject(ActivatedRoute);
  private cartService = inject(ProductsCartService);

  paymentId = this.route.snapshot.queryParams['payment_id'] ?? '—';
  status = this.route.snapshot.queryParams['status'] ?? 'approved';

  constructor() {
    this.cartService.clearCart();
  }
}
