export interface MercadoPagoItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
  picture_url?: string;
}

export interface MercadoPagoBackUrls {
  success: string;
  failure: string;
  pending: string;
}

export interface CreatePreferenceRequest {
  items: MercadoPagoItem[];
  back_urls: MercadoPagoBackUrls;
  auto_return: 'approved' | 'all';
  external_reference: string;
  notification_url?: string;
}

export interface CreatePreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export interface MercadoPagoPaymentStatus {
  payment_id: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled' | 'in_process';
  external_reference: string;
  merchant_order_id: string;
}
