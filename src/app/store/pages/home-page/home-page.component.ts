import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardSkeletonComponent } from '@products/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import { timer, throwError } from 'rxjs';
import { catchError, finalize, switchMap, timeout } from 'rxjs/operators';


@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, PaginationComponent, ProductCardSkeletonComponent, SearchBarComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent  {
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  productosOriginal: any[] = [];
  productosFiltrados: any[] = [];

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

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
}
