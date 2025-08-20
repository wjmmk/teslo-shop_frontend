import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Options } from '@products/interfaces/product.option.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';


const baseUrl = environment.baseUrl;

const option2 = {
  limit: 16,
  offset: 0,
  gender: ''
};

const emtyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})

export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>(); // Esto recibe en el primer parametro un (id). (11111: ⬇)

  getAllProducts(options: Options):Observable<ProductsResponse> {
    const { limit = 16, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`; // Esto me crea una llave para ser utilizada en el caché-

    if(this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!)
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: { limit, offset, gender }
    })
    .pipe(
      //tap((products) => console.log('Productos de la Tienda: ', products)),
      tap((resp) => this.productsCache.set(key, resp))
    )
  }

  //Estamos manejando la busqueda de productos
  getAllProductsToFilter(term: string): Observable<ProductsResponse> {
    const { limit, offset, gender } = option2;

    const request = this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: { limit, offset, gender }
    }).pipe(
      //tap((resp) => console.log('Search term: ', resp)),
      map((resp) => ({
        ...resp,
        products: resp.products.filter(product => {
          const resp = product.title.toLowerCase().includes(term.toLowerCase());
          //console.log('Filtered Product: ', product);
          return resp;
        })
      }))
    );
    return request;
  }

  getProductByIdOrSlug(idSlug: string):Observable<Product> {
    if(this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
    .pipe(
     // delay(2000),
     // tap((product) => console.log('Producto de la Tienda: ', product)),
      tap((product) => this.productCache.set(idSlug, product))
    )
  }

  getProductById(id: string):Observable<Product> {
    if(id === 'new') return of(emtyProduct); // Esto es para que no me de error al momento de crear un nuevo producto.

    if(this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }
    return this.http.get<Product>(`${baseUrl}/products/${id}`)
    .pipe(
      tap((product) => console.log('Producto de la Tienda: ', product)),
      tap((product) => this.productCache.set(id, product))
    )
  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    const currentImages = productLike.images || [];
    return this.uploadProductImages(imageFileList)
      .pipe(map((imageName) => ({
        ...productLike,
        images: [...currentImages, ...imageName],
      })),
        switchMap((updatedProduct) =>
          this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
        ),
        tap((product) => this.updateProductCache(product))
      );
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    // Aqui se aplica la actulizacion del Producto basados en la estrategia Caché sin que toque Refrescas la vista. (11111: ⬆)
    this.productCache.set(productId, product);

    // Actualizacion del ProductResponse.
    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => currentProduct.id === productId  ?  product  :  currentProduct
      );
    });
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
      .pipe(
        tap((product) => {
          this.productCache.set(product.id, product);
          this.productsCache.forEach((productResponse) => {
            productResponse.products.unshift(product);
          });
        })
      );
  }

  // Esta es la propueta de la clase de Fernando Herrera.
  /* createProduct(): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
      .pipe(tap((product) => this.updateProductCache(product)));
  } */

  uploadProductImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }

  uploadProductImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);
    const uploadObservables = Array.from(images).map((imageFile) => this.uploadProductImage(imageFile));
    return forkJoin(uploadObservables).pipe(tap((images) => console.log('Imagenes subidas: ', images)));
  }
}
