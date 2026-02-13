import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';

const CART_STORAGE_KEY = 'teslo_cart';

@Injectable({
  providedIn: 'root'
})
export class ProductsCartService {
  products = signal<Product[]>(this.loadCartFromStorage());
  isCartOpen = signal(false);

  cartItemCount = computed(() => {
    return this.products().reduce((acc, p) => acc + p.stock, 0);
  });

  constructor() {
    // Persistencia automática en localStorage
    effect(() => {
      this.saveCartToStorage(this.products());
    });
  }

  /**
   * Carga el carrito desde localStorage
   */
  private loadCartFromStorage(): Product[] {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  }

  /**
   * Guarda el carrito en localStorage
   */
  private saveCartToStorage(products: Product[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  toggleCart() {
    this.isCartOpen.update(v => !v);
  }

  openCart() {
    this.isCartOpen.set(true);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  addProduct(product: Product): void {
    const existing = this.products().find(p => p.id === product.id);
    if (existing) {
      existing.stock += 1;// Pending
      this.products.update(list => [...list]);
    } else {
      this.products.update(list => [...list, { ...product, stock: 1 }]);
    }
  }

  removeProduct(id: string): void {
    const currentProducts = this.products();
    const productToRemove = currentProducts.find(p => p.id === id);

    if (productToRemove) {
      if (productToRemove.stock > 1) {
        // Si hay más de una unidad, reducimos el stock en 1
        this.products.update(list =>
          list.map(p =>
            p.id === id
              ? { ...p, stock: p.stock - 1 }
              : p
          )
        );
      } else {
        // Si solo hay una unidad, eliminamos el producto completamente
        this.products.update(list => list.filter(p => p.id !== id));
      }
      //console.log('Producto actualizado/eliminado del carrito:', productToRemove);
    }
  }

  get total(): number {
    return this.products().reduce((acc, p) => acc + p.price * p.stock, 0);
  }

  /**
   * Limpia el carrito completamente
   */
  clearCart(): void {
    this.products.set([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  /**
   * Obtiene el subtotal sin impuestos
   */
  get subtotal(): number {
    return this.total;
  }

  /**
   * Calcula impuestos (16% IVA)
   */
  get tax(): number {
    return this.subtotal * 0.16;
  }

  /**
   * Calcula el total con impuestos
   */
  get totalWithTax(): number {
    return this.subtotal + this.tax;
  }
}
