import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCardSkeletonComponent } from '@products/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { SearchBarComponent } from '@products/components/search-bar/search-bar.component';
import { ProductsCartService } from '@products/services/products-cart.service';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ShoppingCartComponent } from '@store/components/shopping-cart/shopping-cart.component';
import { timer, throwError, map } from 'rxjs';
import { catchError, finalize, switchMap, timeout } from 'rxjs/operators';

@Component({
    selector: 'app-gender-page',
    imports: [ProductCardComponent, PaginationComponent, ShoppingCartComponent, ProductCardSkeletonComponent, SearchBarComponent],
    templateUrl: './gender-page.component.html'
})
export class GenderPageComponent {
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  productsCartService = inject(ProductsCartService);
  paginationService = inject(PaginationService);
  
  isCartOpen = this.productsCartService.isCartOpen;

  productosOriginal: any[] = [];
  productosFiltrados: any[] = [];

  gender = toSignal(this.route.params.pipe(
    map( ({ gender }) => {
      return gender;
    })
  ))

  readonly productsResource = rxResource({
    request: () => ({ gender: this.gender(), page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      this.isLoading.set(true);
      this.hasError.set(false);

      return timer(0) // ✅ delay ligero para UX
        .pipe(
          switchMap(() =>
            this.productsService.getAllProducts({ gender: request.gender, offset: request.page * 9 }).pipe(
              timeout(10000), // ✅ tiempo razonable para producción
              catchError((error) => {
                this.hasError.set(true);
                return throwError(() => error);
              }),
              finalize(() => {
                this.isLoading.set(false);
              })
            )
          )
        );
    }
  });

  filtrarProductos(termino: string) {
    this.productosFiltrados = this.productosOriginal.filter(p =>
      p.title.toLowerCase().includes(termino.toLowerCase())
    );
  }

  toggleCart() {
    this.isCartOpen.update(value => !value);
  }
}
