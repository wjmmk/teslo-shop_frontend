import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { environment } from '@environments/environment';

const baseUrl = environment.baseUrl;

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: '1',
    title: 'Test Product',
    price: 100,
    description: 'A test product',
    slug: 'test-product',
    stock: 10,
    sizes: ['M', 'L'] as any,
    gender: Gender.Men,
    tags: ['test'],
    images: ['test-image.jpg'],
    user: { id: '1', email: 'test@test.com', fullName: 'Test', isActive: true, roles: ['user'] },
  };

  const mockProductsResponse: ProductsResponse = {
    count: 1,
    pages: 1,
    products: [mockProduct],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProducts()', () => {
    it('should fetch products with default options', () => {
      service.getAllProducts({}).subscribe((response) => {
        expect(response).toEqual(mockProductsResponse);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/products?limit=16&offset=0&gender=`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProductsResponse);
    });

    it('should fetch products with custom options', () => {
      service
        .getAllProducts({ limit: 10, offset: 5, gender: 'women' })
        .subscribe();

      const req = httpMock.expectOne(
        `${baseUrl}/products?limit=10&offset=5&gender=women`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockProductsResponse);
    });

    it('should return cached response on subsequent calls', () => {
      service.getAllProducts({}).subscribe();
      httpMock
        .expectOne(`${baseUrl}/products?limit=16&offset=0&gender=`)
        .flush(mockProductsResponse);

      service.getAllProducts({}).subscribe((response) => {
        expect(response).toEqual(mockProductsResponse);
      });

      httpMock.expectNone(`${baseUrl}/products?limit=16&offset=0&gender=`);
    });

    it('should use different cache keys for different options', () => {
      service.getAllProducts({ gender: 'men' }).subscribe();
      httpMock
        .expectOne(`${baseUrl}/products?limit=16&offset=0&gender=men`)
        .flush(mockProductsResponse);

      service.getAllProducts({ gender: 'women' }).subscribe();
      httpMock
        .expectOne(`${baseUrl}/products?limit=16&offset=0&gender=women`)
        .flush(mockProductsResponse);
    });
  });

  describe('getAllProductsToFilter()', () => {
    it('should fetch and filter products by term', () => {
      const allProducts: ProductsResponse = {
        count: 2,
        pages: 1,
        products: [
          mockProduct,
          { ...mockProduct, id: '2', title: 'Other Product', slug: 'other' },
        ],
      };

      service.getAllProductsToFilter('Test').subscribe((response) => {
        expect(response.products.length).toBe(1);
        expect(response.products[0].id).toBe('1');
      });

      const req = httpMock.expectOne(
        `${baseUrl}/products?limit=16&offset=0&gender=`
      );
      req.flush(allProducts);
    });

    it('should return empty array when no products match', () => {
      service.getAllProductsToFilter('nonexistent').subscribe((response) => {
        expect(response.products.length).toBe(0);
      });

      const req = httpMock.expectOne(
        `${baseUrl}/products?limit=16&offset=0&gender=`
      );
      req.flush(mockProductsResponse);
    });
  });

  describe('getProductByIdOrSlug()', () => {
    it('should fetch product by id or slug', () => {
      service.getProductByIdOrSlug('test-product').subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/products/test-product`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProduct);
    });

    it('should return cached product on subsequent call', () => {
      service.getProductByIdOrSlug('test-product').subscribe();
      httpMock.expectOne(`${baseUrl}/products/test-product`).flush(mockProduct);

      service.getProductByIdOrSlug('test-product').subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      httpMock.expectNone(`${baseUrl}/products/test-product`);
    });
  });

  describe('getProductById()', () => {
    it('should return empty product for id "new"', () => {
      service.getProductById('new').subscribe((product) => {
        expect(product.id).toBe('new');
        expect(product.title).toBe('');
      });

      httpMock.expectNone(`${baseUrl}/products/new`);
    });

    it('should fetch product by numeric id', () => {
      service.getProductById('1').subscribe((product) => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/products/1`);
      req.flush(mockProduct);
    });
  });

  describe('createProduct()', () => {
    it('should create a product and update cache', () => {
      const newProduct = { title: 'New Product', price: 50, gender: Gender.Men };

      service.createProduct(newProduct).subscribe((product) => {
        expect(product.id).toBe('new-id');
        expect(product.title).toBe('New Product');
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush({ ...mockProduct, id: 'new-id', title: 'New Product', price: 50 });
    });
  });

  describe('updateProduct()', () => {
    it('should update product without images', () => {
      const update = { title: 'Updated Title', price: 150 };

      service.updateProduct('1', update).subscribe((product) => {
        expect(product.title).toBe('Updated Title');
      });

      const req = httpMock.expectOne(`${baseUrl}/products/1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.title).toBe('Updated Title');
      req.flush({ ...mockProduct, title: 'Updated Title', price: 150 });
    });
  });

  describe('uploadProductImage()', () => {
    it('should upload a single image', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

      service.uploadProductImage(file).subscribe((fileName) => {
        expect(fileName).toBe('uploaded-image.jpg');
      });

      const req = httpMock.expectOne(`${baseUrl}/files/product`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTrue();
      req.flush({ fileName: 'uploaded-image.jpg' });
    });
  });

  describe('uploadProductImages()', () => {
    it('should return empty array when no files provided', () => {
      service.uploadProductImages(undefined).subscribe((images) => {
        expect(images).toEqual([]);
      });

      httpMock.expectNone(`${baseUrl}/files/product`);
    });

    it('should upload multiple images', () => {
      const fileList = {
        0: new File([''], 'img1.jpg', { type: 'image/jpeg' }),
        1: new File([''], 'img2.jpg', { type: 'image/jpeg' }),
        length: 2,
        item: (i: number) =>
          i === 0
            ? new File([''], 'img1.jpg', { type: 'image/jpeg' })
            : new File([''], 'img2.jpg', { type: 'image/jpeg' }),
      } as FileList;

      const images: string[] = [];
      service.uploadProductImages(fileList).subscribe((result) => {
        images.push(...result);
      });

      const reqs = httpMock.match(`${baseUrl}/files/product`);
      expect(reqs.length).toBe(2);
      reqs[0].flush({ fileName: 'img1-uploaded.jpg' });
      reqs[1].flush({ fileName: 'img2-uploaded.jpg' });

      expect(images.length).toBe(2);
      expect(images).toEqual(['img1-uploaded.jpg', 'img2-uploaded.jpg']);
    });
  });
});
