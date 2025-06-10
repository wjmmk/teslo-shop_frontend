import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@environments/environment.development';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { TransforsPipe } from "../../../shared/pipes/transfors.pipe";

@Component({
    selector: 'product-card',
    imports: [RouterLink, SlicePipe, ProductImagePipe, TransforsPipe],
    templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  product = input.required<Product>();
  baseUrl = environment.baseUrl;

  imageUrl = computed( () => {
    return `${this.baseUrl}/files/product/${this.product().images[0]}`;
  })
}
