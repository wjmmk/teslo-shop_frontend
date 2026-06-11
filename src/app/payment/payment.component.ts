import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsCartService } from '@products/services/products-cart.service';
import { PaymentService } from 'src/app/payment/services/payment.service';
import { MercadoPagoService } from 'src/app/payment/services/mercadopago.service';
import { CardValidator } from 'src/app/Utils/card-validator';
import { InputSanitizer } from 'src/app/Utils/input-sanitizer';
import { PaymentRequest, PaymentStatus } from '@shared/interfaces/payment.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { environment } from '@environments/environment';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ReactiveFormsModule, ProductImagePipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cartService = inject(ProductsCartService);
  private paymentService = inject(PaymentService);
  private mercadopagoService = inject(MercadoPagoService);

  mercadopagoPublicKey = environment.mercadopagoPublicKey;

  paymentMethod = signal<'mercadopago' | 'card'>('mercadopago');

  cardBrand = signal<'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown'>('unknown');
  isProcessing = signal(false);
  paymentError = signal<string | null>(null);
  showSuccess = signal(false);

  cartProducts = this.cartService.products;
  subtotal = computed(() => this.cartService.subtotal);
  tax = computed(() => this.cartService.tax);
  total = computed(() => this.cartService.totalWithTax);

  paymentForm = this.fb.group({
    cardHolder: ['', [Validators.required, Validators.minLength(3), this.nameValidator]],
    cardNumber: ['', [Validators.required, this.cardNumberValidator.bind(this)]],
    expiryDate: ['', [Validators.required, this.expiryDateValidator]],
    cvv: ['', [Validators.required, this.cvvValidator.bind(this)]]
  });

  private nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = InputSanitizer.sanitizeString(control.value);
    const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!namePattern.test(value)) {
      return { invalidName: true };
    }
    return null;
  }

  private cardNumberValidator(control: AbstractControl): ValidationErrors | null {
    const sanitized = InputSanitizer.sanitizeCardNumber(control.value);

    if (!CardValidator.validateCardNumber(sanitized)) {
      return { invalidCard: true };
    }

    this.cardBrand.set(CardValidator.detectCardBrand(sanitized));
    return null;
  }

  private expiryDateValidator(control: AbstractControl): ValidationErrors | null {
    const sanitized = InputSanitizer.sanitizeExpiryDate(control.value);

    if (!CardValidator.validateExpiryDate(sanitized)) {
      return { invalidExpiry: true };
    }
    return null;
  }

  private cvvValidator(control: AbstractControl): ValidationErrors | null {
    const sanitized = InputSanitizer.sanitizeCVV(control.value);
    const brand = this.cardBrand();

    if (!CardValidator.validateCVV(sanitized, brand)) {
      return { invalidCVV: true };
    }
    return null;
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = InputSanitizer.sanitizeCardNumber(input.value);
    const formatted = CardValidator.formatCardNumber(sanitized);
    input.value = formatted;
    this.paymentForm.patchValue({ cardNumber: formatted }, { emitEvent: false });
  }

  onExpiryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = InputSanitizer.sanitizeExpiryDate(input.value);

    if (value.length >= 2 && !value.includes('/')) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    input.value = value;
    this.paymentForm.patchValue({ expiryDate: value }, { emitEvent: false });
  }

  selectMethod(method: 'mercadopago' | 'card'): void {
    this.paymentMethod.set(method);
    this.paymentError.set(null);
  }

  async payWithMercadoPago(): Promise<void> {
    if (this.cartProducts().length === 0) {
      this.paymentError.set('El carrito está vacío');
      return;
    }

    this.isProcessing.set(true);
    this.paymentError.set(null);

    try {
      const origin = window.location.origin;
      const hashPrefix = origin + '/#';

      const response = await firstValueFrom(
        this.mercadopagoService.createPreference({
          items: this.cartProducts().map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description || p.title,
            quantity: p.stock,
            unit_price: p.price,
            currency_id: 'ARS',
            picture_url: p.images[0]
              ? `${origin}/api/files/product/${p.images[0]}`
              : undefined,
          })),
          back_urls: {
            success: `${hashPrefix}/payment/success`,
            failure: `${hashPrefix}/payment/failure`,
            pending: `${hashPrefix}/payment/pending`,
          },
          auto_return: 'approved',
          external_reference: `ORD-${Date.now()}`,
        }),
      );

      window.location.href = response.initPoint;
    } catch (error: any) {
      console.error('[MercadoPago] Error:', error);
      this.paymentError.set(error.message ?? 'Error al conectar con Mercado Pago');
      this.isProcessing.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid || this.cartProducts().length === 0) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isProcessing.set(true);
    this.paymentError.set(null);

    const formValue = this.paymentForm.value;

    const paymentRequest: PaymentRequest = {
      amount: this.total(),
      currency: 'USD',
      orderId: `ORD-${Date.now()}`,
      paymentMethod: {
        type: 'credit_card',
        cardNumber: InputSanitizer.sanitizeCardNumber(formValue.cardNumber!),
        cardHolder: InputSanitizer.sanitizeString(formValue.cardHolder!),
        expiryDate: formValue.expiryDate!,
        cvv: formValue.cvv!
      },
      items: this.cartProducts().map(p => ({
        productId: p.id,
        title: p.title,
        quantity: p.stock,
        price: p.price
      }))
    };

    this.paymentService.processPayment(paymentRequest).subscribe({
      next: (response) => {
        this.isProcessing.set(false);
        this.showSuccess.set(true);
        this.paymentService.lastTransaction.set(response);

        setTimeout(() => {
          this.cartService.clearCart();
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error) => {
        this.isProcessing.set(false);
        this.paymentError.set(error.message || 'Error al procesar el pago');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/catalog']);
  }

  getFieldError(fieldName: string): string | null {
    const field = this.paymentForm.get(fieldName);

    if (!field || !field.touched || !field.errors) {
      return null;
    }

    const errors = field.errors;

    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['invalidName']) return 'Nombre inválido (solo letras)';
    if (errors['invalidCard']) return 'Número de tarjeta inválido';
    if (errors['invalidExpiry']) return 'Fecha de expiración inválida o vencida';
    if (errors['invalidCVV']) return 'CVV inválido';

    return 'Campo inválido';
  }
}
