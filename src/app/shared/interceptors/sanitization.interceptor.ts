import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { InputSanitizer } from '@shared/utils/input-sanitizer';

/**
 * Interceptor de sanitización para prevenir XSS
 * Sanitiza todos los datos enviados en peticiones HTTP
 */
export const sanitizationInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Solo sanitiza peticiones POST, PUT, PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const sanitizedBody = sanitizeObject(req.body);
    
    const sanitizedReq = req.clone({
      body: sanitizedBody
    });
    
    return next(sanitizedReq);
  }
  
  return next(req);
};

/**
 * Sanitiza recursivamente un objeto
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return InputSanitizer.sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // No sanitiza campos sensibles como passwords o tokens
        if (['password', 'token', 'cvv', 'cardNumber'].includes(key)) {
          sanitized[key] = obj[key];
        } else {
          sanitized[key] = sanitizeObject(obj[key]);
        }
      }
    }
    return sanitized;
  }

  return obj;
}
