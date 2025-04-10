import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Options } from '@products/interfaces/product.option.interface';
import { Observable, tap } from 'rxjs';


const baseUrl = environment.baseUrl;

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);

  getAllProducts(options: Options):Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: { limit, offset, gender }
    })
    .pipe(
      //tap((products) => console.log('Productos de la Tienda: ', products))
    )
  }

  getProductByIdOrSlug(idSlug: string):Observable<Product> {
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`);
  }
}
