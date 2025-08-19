import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { ProductsService } from '@products/services/products.service';
import { TransLatePipe } from "../../../shared/pipes/translate.pipe";
import { ProductsCartService } from '@products/services/products-cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-product-page',
    imports: [ProductCarouselComponent, TransLatePipe, CurrencyPipe],
    templateUrl: './product-page.component.html'
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  productsCartService = inject(ProductsCartService);
  rating: number = 4.5;

  constructor(private router: Router) { }

  productIdOrSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdOrSlug }),
    loader: ({ request }) => {
      return this.productsService.getProductByIdOrSlug(request.idSlug);
    }
  });

  addToCart() {
    this.productsCartService.addProduct(this.productResource.value()!);
    this.router.navigate(['/']);
  }
}
