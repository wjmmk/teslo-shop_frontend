import { computed, Injectable, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsCartService {
  products = signal<Product[]>([]);

  cartItemCount = computed(() => {
    return this.products().reduce((acc, p) => acc + p.stock, 0);
  });

  constructor() { }


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
}
