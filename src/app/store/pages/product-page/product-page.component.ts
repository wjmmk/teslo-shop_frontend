import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';

@Component({
    selector: 'app-product-page',
    imports: [],
    templateUrl: './product-page.component.html'
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  productIdOrSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdOrSlug }),
    loader: ({ request }) => {
      return this.productsService.getProductByIdOrSlug(request.idSlug);
    }
  });
}
