import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardSkeletonComponent } from '@products/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { SearchBarComponent } from '@products/components/search-bar/search-bar.component';
import { Product } from '@products/interfaces/product.interface';
import { ProductsCartService } from '@products/services/products-cart.service';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ShoppingCartComponent } from '@store/components/shopping-cart/shopping-cart.component';
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
  productsService = inject(ProductsService);
  productsCartService = inject(ProductsCartService);
  isCartOpen = this.productsCartService.isCartOpen;

  productosOriginal: any[] = [];
  productosFiltrados: any[] = [];
  paginationService = inject(PaginationService);

  products = this.productsCartService.products();


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

  // con este metodo se logra agrupar la respuesta del Servicio de (3 - 3). Para aplicar el Diseño Masonry.
  readonly productsGroupedForMasonry = computed(() => {
    const resp = this.productsResource.value();
    if (!resp) return [];
    const grouped: Product[][] = [];
    for (let i = 0; i < resp.products.length; i += 3) {
      grouped.push(resp.products.slice(i, i + 3));
    }
    return grouped;
  })

  filtrarProductos(termino: string) {
    this.productosFiltrados = this.productosOriginal.filter(p =>
      p.title.toLowerCase().includes(termino.toLowerCase())
    );
  }

  toggleCart() {
    this.isCartOpen.update(value => !value);
  }
}
