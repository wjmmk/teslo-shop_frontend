import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchTerm = signal<string>('');
  private searchSubscription?: Subscription;

  private readonly _router = inject(Router);
  private readonly _productsService = inject(ProductsService);

  constructor() { }

  products = signal<Product[]>([]);

  onSearch(event: any) {
    const term = event.target.value;

    console.log('Search term: ', term);

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    this.searchSubscription = this._productsService.getAllProducts(term)
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((products: any) => {
        this.products.set(products);
      });
  }

  goToDetails(id: string) {
    this.products.set([]);
    this._router.navigate(['/product', id]);
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  filterProducts = rxResource({
    request: this.searchTerm,
    loader: () => this._productsService.getProductById(this.searchTerm())
  });

  //Limpio el termino a buscar dentro de la barra de busqueda
  private _clearQuery(): void {
    this.searchTerm.set('');
  }

}
