import { SlicePipe } from '@angular/common';
import { Component, computed, input, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@environments/environment.development';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { TransLatePipe } from '@shared/pipes/translate.pipe';

@Component({
    selector: 'product-card',
    imports: [RouterLink, SlicePipe, ProductImagePipe, TransLatePipe],
    templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  product = input.required<Product>();
  baseUrl = environment.baseUrl;
  productsArray: Product[] = [];
  visualRating: number = 0;

  // Si el product viene como Input, es buena práctica recalcular si cambia
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.calculateVisualRating();
    }
  }

  // Metodo para calcular el rating visual basado en el stock, esta es una implementacion algo absurda pero funcional.
  private calculateVisualRating(): void {
    if (this.product && typeof this.product().stock === 'number') {
      const stockAsString = this.product().stock.toString();
      if (stockAsString.length > 0) {
        // Tomamos el primer dígito y lo convertimos a número
        let firstDigit = parseInt(stockAsString.charAt(0), 10);

        // Aseguramos que el rating esté entre 1 y 5
        // Si el primer dígito es 0, lo ponemos a 1 (o el valor mínimo que quieras)
        if (firstDigit === 0) {
          firstDigit = 1;
        }
        // Si el primer dígito es mayor que 5, lo limitamos a 5
        if (firstDigit > 5) {
          firstDigit = 5;
        }
        this.visualRating = firstDigit;
      }
    }
  }

  imageUrl = computed( () => {
    return `${this.baseUrl}/files/product/${this.product().images[0]}`;
  })


  addToCart() {}

}
