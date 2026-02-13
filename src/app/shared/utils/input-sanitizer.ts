// Input Sanitization Utility - Security Layer
export class InputSanitizer {
  
  /**
   * Sanitiza strings removiendo caracteres peligrosos para XSS
   */
  static sanitizeString(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Valida y sanitiza número de tarjeta (solo dígitos)
   */
  static sanitizeCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\D/g, '');
  }

  /**
   * Valida formato de fecha de expiración MM/YY
   */
  static sanitizeExpiryDate(date: string): string {
    return date.replace(/[^\d/]/g, '').slice(0, 5);
  }

  /**
   * Valida CVV (solo 3-4 dígitos)
   */
  static sanitizeCVV(cvv: string): string {
    return cvv.replace(/\D/g, '').slice(0, 4);
  }

  /**
   * Enmascara número de tarjeta para mostrar solo últimos 4 dígitos
   */
  static maskCardNumber(cardNumber: string): string {
    const sanitized = this.sanitizeCardNumber(cardNumber);
    if (sanitized.length < 4) return '****';
    return `**** **** **** ${sanitized.slice(-4)}`;
  }
}
