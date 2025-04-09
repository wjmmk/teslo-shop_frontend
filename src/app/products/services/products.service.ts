import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);

  getAllProducts():Observable<ProductsResponse[]> {
    return this.http.get<ProductsResponse[]>('http://localhost:3000/api/products')
    .pipe(
      tap((products) => console.log(products))
    )
  }
}
