import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductsService } from '@products/services/products.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  imports: [ProductImagePipe]
})
export class SearchBarComponent {
   // Agregamos el EventEmitter
  @Output() search = new EventEmitter<string>();
  private readonly _router = inject(Router);
  private readonly _productsService = inject(ProductsService);

  // Signals
  products = signal<Product[]>([]);
  isLoading = signal(false);
  private inputFocused = signal(false);

  private searchSubscription?: Subscription;

  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;

    // Emitimos el término al padre
    this.search.emit(term);

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (term.length < 2) {
      this.products.set([]);
      return;
    }

    this.isLoading.set(true);

    this.searchSubscription = this._productsService
      .getAllProductsToFilter(term)
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe({
        next: (response) => {
          this.products.set(response.products);
          this.isLoading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.isLoading.set(false);
        }
      });
  }

  goToDetails(id: string): void {
    this._router.navigate(['/product', id]);
    this.products.set([]); // Limpiar resultados al navegar
  }

  isInputFocused() {
    return this.inputFocused();
  }

  onFocus() {
    this.inputFocused.set(true);
  }

  onBlur() {
    setTimeout(() => {
      this.inputFocused.set(false);
      this.products.set([]); // Limpiar resultados al perder el foco
    }, 200);
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}
