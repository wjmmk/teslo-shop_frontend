// Card Validation Utility - Luhn Algorithm + Brand Detection
export class CardValidator {
  
  /**
   * Detecta el tipo de tarjeta basado en el número
   */
  static detectCardBrand(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown' {
    const sanitized = cardNumber.replace(/\D/g, '');
    
    if (/^4/.test(sanitized)) return 'visa';
    if (/^5[1-5]/.test(sanitized)) return 'mastercard';
    if (/^3[47]/.test(sanitized)) return 'amex';
    if (/^6(?:011|5)/.test(sanitized)) return 'discover';
    
    return 'unknown';
  }

  /**
   * Valida número de tarjeta usando algoritmo de Luhn
   */
  static validateCardNumber(cardNumber: string): boolean {
    const sanitized = cardNumber.replace(/\D/g, '');
    
    if (sanitized.length < 13 || sanitized.length > 19) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Valida fecha de expiración
   */
  static validateExpiryDate(expiryDate: string): boolean {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const expiry = new Date(year, month - 1);

    return expiry > now;
  }

  /**
   * Valida CVV
   */
  static validateCVV(cvv: string, cardBrand: string): boolean {
    const sanitized = cvv.replace(/\D/g, '');
    
    if (cardBrand === 'amex') {
      return sanitized.length === 4;
    }
    
    return sanitized.length === 3;
  }

  /**
   * Formatea número de tarjeta con espacios
   */
  static formatCardNumber(cardNumber: string): string {
    const sanitized = cardNumber.replace(/\D/g, '');
    const brand = this.detectCardBrand(sanitized);
    
    if (brand === 'amex') {
      return sanitized.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    
    return sanitized.replace(/(\d{4})/g, '$1 ').trim();
  }
}
