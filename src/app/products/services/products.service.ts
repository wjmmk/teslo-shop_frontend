import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Options } from '@products/interfaces/product.option.interface';
import { delay, Observable, of, tap } from 'rxjs';


const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getAllProducts(options: Options):Observable<ProductsResponse> {
    const { limit = 12, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`; // Esto me crea una llave para ser utilizada en el caché-

    if(this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!)
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: { limit, offset, gender }
    })
    .pipe(
      tap((products) => console.log('Productos de la Tienda: ', products)),
      tap((resp) => this.productsCache.set(key, resp))
    )
  }

  getProductByIdOrSlug(idSlug: string):Observable<Product> {
    if(this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
    .pipe(
     // delay(2000),
      tap((product) => this.productCache.set(idSlug, product))
    )
  }
}
