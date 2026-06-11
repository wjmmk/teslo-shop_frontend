import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PaymentService } from './payment.service';
import {
  PaymentRequest,
  PaymentStatus,
} from '@shared/interfaces/payment.interface';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockPaymentRequest: PaymentRequest = {
    amount: 100,
    currency: 'USD',
    orderId: 'order-1',
    paymentMethod: {
      type: 'credit_card',
      cardNumber: '4111111111111111',
      cardHolder: 'Test User',
      expiryDate: '12/28',
      cvv: '123',
    },
    items: [
      { productId: '1', title: 'Test Product', quantity: 1, price: 100 },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have IDLE status initially', () => {
    expect(service.paymentStatus()).toBe(PaymentStatus.IDLE);
    expect(service.lastTransaction()).toBeNull();
  });

  it('should set status to PROCESSING when payment starts', () => {
    service.processPayment(mockPaymentRequest).subscribe();

    expect(service.paymentStatus()).toBe(PaymentStatus.PROCESSING);
  });

  it('should process payment successfully', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.95);

    let response: any;
    service.processPayment(mockPaymentRequest).subscribe((res) => {
      response = res;
    });

    tick(2000);

    expect(response.success).toBeTrue();
    expect(response.transactionId).toBeDefined();
    expect(response.transactionId).toContain('TXN-');
    expect(response.message).toBe('Pago procesado exitosamente');
  }));

  it('should handle payment error', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.05);

    let errorResponse: any;
    service.processPayment(mockPaymentRequest).subscribe({
      error: (err) => {
        errorResponse = err;
      },
    });

    tick(2000);

    expect(errorResponse).toBeDefined();
    expect(errorResponse.success).toBeFalse();
    expect(errorResponse.message).toContain('Error');
  }));

  it('should reset payment status', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0.95);

    service.processPayment(mockPaymentRequest).subscribe();
    tick(2000);

    service.resetPaymentStatus();

    expect(service.paymentStatus()).toBe(PaymentStatus.IDLE);
    expect(service.lastTransaction()).toBeNull();
  }));

  it('should generate unique transaction IDs', () => {
    const id1 = (service as any).generateTransactionId();
    const id2 = (service as any).generateTransactionId();

    expect(id1).not.toBe(id2);
  });
});
