import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { ProductsService } from '@products/services/products.service';
import { TransforsPipe } from "../../../shared/pipes/transfors.pipe";

@Component({
    selector: 'app-product-page',
    imports: [ProductCarouselComponent, TransforsPipe],
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


  addToCart() {}
  rating: number = 4.5;
}
