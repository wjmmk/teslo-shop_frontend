import { SlicePipe, CurrencyPipe } from '@angular/common';
import { Component, computed, input, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@environments/environment.development';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { TransLatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'product-card',
  imports: [
    RouterLink,
    SlicePipe,
    ProductImagePipe,
    TransLatePipe,
    CurrencyPipe,
  ],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  product = input.required<Product>();
  baseUrl = environment.baseUrl;
  productsArray: Product[] = [];
  visualRating: number = 0;
  logArray: number[] = [1,2,3,4,5];

  // Si el product viene como Input, es buena práctica recalcular si cambia
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.calculateVisualRating();
    }
  }

  // Metodo para calcular el rating visual basado en el stock, esta es una implementacion algo absurda pero funcional.
  private calculateVisualRating(): void {
    const randomRating = Math.random() * (5 - 1) + 1;
    this.visualRating = parseFloat(randomRating.toFixed(1));
  }

  imageUrl = computed(() => {
    return `${this.baseUrl}/files/product/${this.product().images[0]}`;
  });

  addToCart() {}
}
