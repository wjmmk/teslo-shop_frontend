import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { TransLatePipe } from "../../../shared/pipes/translate.pipe";
import { ProductsCartService } from '@products/services/products-cart.service';
import { CurrencyPipe } from '@angular/common';
import { ProductCarouselComponent } from '@products/components/product-carousel/product-carousel.component';
import { ShoppingCartComponent } from '@products/components/shopping-cart/shopping-cart.component';

@Component({
    selector: 'app-product-page',
    imports: [ProductCarouselComponent, ShoppingCartComponent, TransLatePipe, CurrencyPipe],
    templateUrl: './product-page.component.html'
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  productsCartService = inject(ProductsCartService);
  isCartOpen = signal(false);
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
    //this.router.navigate(['/']);
  }

  toggleCart() {
    this.isCartOpen.update(value => !value);
  }
}
