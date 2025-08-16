import { DecimalPipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart',
  imports: [DecimalPipe],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  @Input() isOpen = false; // Para controlar la visibilidad del carrito
  products = signal<Product[]>([]);

  addProduct(product: Product) {
    const existing = this.products().find(p => p.id === product.id);
    if (existing) {
      existing.quantity += 1;
      this.products.update(list => [...list]);
    } else {
      this.products.update(list => [...list, { ...product, quantity: 1 }]);
    }
  }

  removeProduct(id: number) {
    this.products.update(list => list.filter(p => p.id !== id));
  }

  get total() {
    return this.products().reduce((acc, p) => acc + p.price * p.quantity, 0);
  }
}
