import { Component, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductsService } from '@products/services/products.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'search-bar',
  imports: [ProductImagePipe],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchTerm = signal<string>('');
  private searchSubscription?: Subscription;
  private inputFocused = signal(false);
  /* products = signal<Product[]>([]); */

  private readonly _router = inject(Router);
  private readonly _productsService = inject(ProductsService);

  constructor() { }

  products = linkedSignal<Product[]>(() => this.filterProducts.value()?.products ?? ([] as Product[]));

  filterProducts = rxResource({
    request: this.searchTerm,
    loader: () => this._productsService.getAllProductsToFilter(this.searchTerm())
  });

  //De este metodo debo obtener el Id y pasarselo al API response para que busque el producto especifico.
  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (term.length < 2) {
      this.products.set([]);
      return;
    }

    this.searchSubscription = this._productsService
      .getAllProductsToFilter(term)
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(response => {
        this.products.set(response.products);
      });

    this._clearSearch();
  }

  goToDetails(id: string): void {
    this._router.navigate(['/product', id]);
    this._clearSearch();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  //Limpio el termino a buscar dentro de la barra de busqueda
  private _clearSearch(): void {
    this.searchTerm.set('');
  }

  //Referencia para el filtrado de productos.

  isInputFocused() {
    return this.inputFocused();
  }

  onFocus() {
    this.inputFocused.set(true);
  }

  onBlur() {
    // Pequeño delay para permitir que el click en los resultados funcione
    setTimeout(() => {
      this.inputFocused.set(false);
    }, 200);
  }
}
