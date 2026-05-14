import { TestBed } from '@angular/core/testing';

import { ProductsCartService } from './products-cart.service';
import { Gender, Product } from '@products/interfaces/product.interface';

describe('ProductsCartService', () => {
  let service: ProductsCartService;

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
    images: ['test.jpg'],
    user: { id: '1', email: 'test@test.com', fullName: 'Test', isActive: true, roles: ['user'] },
  };

  const mockProduct2: Product = {
    ...mockProduct,
    id: '2',
    title: 'Another Product',
    price: 50,
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty cart', () => {
    expect(service.products().length).toBe(0);
    expect(service.cartItemCount()).toBe(0);
    expect(service.total).toBe(0);
  });

  it('should start with cart closed', () => {
    expect(service.isCartOpen()).toBeFalse();
  });

  describe('addProduct()', () => {
    it('should add a new product to the cart', () => {
      service.addProduct(mockProduct);

      expect(service.products().length).toBe(1);
      expect(service.products()[0].id).toBe('1');
      expect(service.products()[0].stock).toBe(1);
    });

    it('should increment stock when adding an existing product', () => {
      service.addProduct(mockProduct);
      service.addProduct(mockProduct);

      expect(service.products().length).toBe(1);
      expect(service.products()[0].stock).toBe(2);
    });

    it('should add different products separately', () => {
      service.addProduct(mockProduct);
      service.addProduct(mockProduct2);

      expect(service.products().length).toBe(2);
      expect(service.cartItemCount()).toBe(2);
    });
  });

  describe('removeProduct()', () => {
    it('should decrement stock when more than 1 unit', () => {
      service.addProduct(mockProduct);
      service.addProduct(mockProduct);
      service.removeProduct('1');

      expect(service.products().length).toBe(1);
      expect(service.products()[0].stock).toBe(1);
    });

    it('should remove product from cart when stock reaches 0', () => {
      service.addProduct(mockProduct);
      service.removeProduct('1');

      expect(service.products().length).toBe(0);
    });

    it('should do nothing when product does not exist', () => {
      service.addProduct(mockProduct);
      service.removeProduct('nonexistent');

      expect(service.products().length).toBe(1);
    });
  });

  describe('cart calculations', () => {
    it('should calculate total correctly', () => {
      service.addProduct(mockProduct);
      expect(service.total).toBe(100);

      service.addProduct(mockProduct);
      expect(service.total).toBe(200);
    });

    it('should calculate subtotal same as total', () => {
      service.addProduct(mockProduct);
      expect(service.subtotal).toBe(service.total);
    });

    it('should calculate tax as 16% of subtotal', () => {
      service.addProduct(mockProduct);
      expect(service.tax).toBe(16);
    });

    it('should calculate totalWithTax as subtotal + tax', () => {
      service.addProduct(mockProduct);
      expect(service.totalWithTax).toBe(116);
    });
  });

  describe('cart visibility', () => {
    it('should toggle cart open state', () => {
      service.toggleCart();
      expect(service.isCartOpen()).toBeTrue();

      service.toggleCart();
      expect(service.isCartOpen()).toBeFalse();
    });

    it('should open cart', () => {
      service.openCart();
      expect(service.isCartOpen()).toBeTrue();
    });

    it('should close cart', () => {
      service.openCart();
      service.closeCart();
      expect(service.isCartOpen()).toBeFalse();
    });
  });

  describe('clearCart()', () => {
    it('should remove all products', () => {
      service.addProduct(mockProduct);
      service.addProduct(mockProduct2);
      service.clearCart();

      expect(service.products().length).toBe(0);
      expect(service.total).toBe(0);
    });
  });

  describe('cartItemCount()', () => {
    it('should return total stock across all products', () => {
      service.addProduct(mockProduct);
      service.addProduct(mockProduct);
      service.addProduct(mockProduct2);

      expect(service.cartItemCount()).toBe(3);
    });

    it('should return 0 for empty cart', () => {
      expect(service.cartItemCount()).toBe(0);
    });
  });
});
