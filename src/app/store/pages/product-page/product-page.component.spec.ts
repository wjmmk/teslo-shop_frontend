import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { ProductPageComponent } from './product-page.component';
import { ProductsService } from '@products/services/products.service';
import { ProductsCartService } from '@products/services/products-cart.service';
import { Gender, Product } from '@products/interfaces/product.interface';

describe('ProductPageComponent', () => {
  let component: ProductPageComponent;
  let fixture: ComponentFixture<ProductPageComponent>;
  let productsServiceMock: jasmine.SpyObj<ProductsService>;

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

  const mockCartService = {
    isCartOpen: signal(false),
    addProduct: jasmine.createSpy('addProduct'),
    cartItemCount: signal(0)
  };

  beforeEach(async () => {
    productsServiceMock = jasmine.createSpyObj('ProductsService', ['getProductByIdOrSlug']);
    productsServiceMock.getProductByIdOrSlug.and.returnValue(of(mockProduct));

    await TestBed.configureTestingModule({
      imports: [ProductPageComponent],
      providers: [
        provideRouter([]),
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ProductsCartService, useValue: mockCartService }
      ]
    })
    .overrideComponent(ProductPageComponent, {
      set: { imports: [], template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract productIdOrSlug from route', () => {
    expect(component.productIdOrSlug).toBeDefined();
  });

  it('should toggle cart open state', () => {
    expect(component.isCartOpen()).toBeFalse();
    component.toggleCart();
    expect(component.isCartOpen()).toBeTrue();
    component.toggleCart();
    expect(component.isCartOpen()).toBeFalse();
  });

  it('should add product to cart and set wasAdded', fakeAsync(() => {
    component.addToCart();
    expect(mockCartService.addProduct).toHaveBeenCalledWith(mockProduct);
    expect(component.wasAdded()).toBeTrue();

    tick(3000);
    expect(component.wasAdded()).toBeFalse();
  }));

  it('should initialize with a valid rating', () => {
    expect(component.rating).toBe(4.5);
  });
});
