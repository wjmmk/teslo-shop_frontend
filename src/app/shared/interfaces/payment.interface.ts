// Payment Interfaces - Type Safety
export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  orderId: string;
  items: PaymentItem[];
}

export interface PaymentItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: Date;
}

export enum PaymentStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  ERROR = 'error'
}
