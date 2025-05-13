import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardSkeletonComponent } from '@products/components/product-card-skeleton/product-card-skeleton.component';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { catchError, finalize, switchMap, throwError, timeout, timer } from 'rxjs';

@Component({
    selector: 'home-page',
    imports: [ProductCardComponent, PaginationComponent, ProductCardSkeletonComponent, CommonModule],
    templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {
  public isLoading = signal(true);
  public hasError = signal(false);

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService)

  ngOnInit() {
    this.productsService.getAllProducts({ offset: 9 });
  }

  productsResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      this.isLoading();
      this.hasError();

      return timer(7000) // le damos un pequeño delay para efecto visual suave
        .pipe(
          switchMap(() =>
            this.productsService.getAllProducts({ offset: request.page * 9 }).pipe(
              timeout(30000), // ⏰ espera máxima de 30 segundos
              catchError((error) => {
                this.hasError();
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
}
