import { Component, inject, Signal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardSkeletonComponent } from '@products/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ShoppingCartComponent } from '@products/components/shopping-cart/shopping-cart.component';
import { Product } from '@products/interfaces/product.interface';
import { ProductsCartService } from '@products/services/products-cart.service';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { timer, throwError } from 'rxjs';
import { catchError, finalize, switchMap, timeout } from 'rxjs/operators';


@Component({
  selector: 'home-list',
  imports: [ProductCardComponent, PaginationComponent, ProductCardSkeletonComponent, SearchBarComponent, ShoppingCartComponent],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent  {
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  isCartOpen = signal(false);

  productosOriginal: any[] = [];
  productosFiltrados: any[] = [];

  productsService = inject(ProductsService);
  productsCartService = inject(ProductsCartService);
  paginationService = inject(PaginationService);

  products = this.productsCartService.products();

  constructor() { }

  readonly productsResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      this.isLoading.set(true);
      this.hasError.set(false);

      return timer(0) // ✅ delay ligero para UX
        .pipe(
          switchMap(() =>
            this.productsService.getAllProducts({ offset: request.page * 9 }).pipe(
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
