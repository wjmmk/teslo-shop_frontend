import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from "../product-table/product-table.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'products-admin-page',
  imports: [ProductTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html'
})
export class ProductsAdminPageComponent {

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productsPerPage = signal(10);

  readonly productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage()
    }),
    loader: ({ request }) => {
      return this.productsService.getAllProducts({
        offset: request.page * 9,
        limit: request.limit
      })
    }
  });

}


