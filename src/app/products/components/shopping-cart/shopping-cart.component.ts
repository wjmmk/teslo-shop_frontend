import { DecimalPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductsCartService } from '@products/services/products-cart.service';


@Component({
  selector: 'shopping-cart',
  imports: [DecimalPipe, ProductImagePipe],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  @Input() isOpen = false; // Para controlar la visibilidad del carrito
  productsCartService = inject(ProductsCartService);
  products = this.productsCartService.products;

  constructor(private router: Router) { }

  removeProduct(product: Product) {
    //console.log('Producto eliminado del carrito: ', product);
    this.productsCartService.removeProduct(product.id);
  }

  closeCart() {
    this.isOpen = false;
    /* this.router.navigate(['/']); */
  }

  checkout() {
    this.router.navigate(['/payment']);
  }
}
