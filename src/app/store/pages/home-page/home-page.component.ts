import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
//import { rxResource } from '@shared/utils/rx-resource';


@Component({
  standalone: true,
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {

  productsService = inject(ProductsService);

 /*  productsResource = rxResource({
    request: () => ({}),
    loader: ({ request}) => { this.productsService.getAllProducts() },
    error: () => ({ error: 'Error loading products' }),
    loading: () => ({ loading: true }),
  }) */
}
