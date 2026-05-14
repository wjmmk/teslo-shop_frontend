import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { HomePageComponent } from './home-page.component';
import { ProductsService } from '@products/services/products.service';
import { ProductsCartService } from '@products/services/products-cart.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let productsServiceMock: jasmine.SpyObj<ProductsService>;

  const mockCartService = {
    isCartOpen: signal(false),
    products: signal([]),
    cartItemCount: signal(0)
  };

  const mockPaginationService = {
    currentPage: signal(1)
  };

  beforeEach(async () => {
    productsServiceMock = jasmine.createSpyObj('ProductsService', ['getAllProducts']);
    productsServiceMock.getAllProducts.and.returnValue(of({ count: 0, pages: 0, products: [] }));

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ProductsCartService, useValue: mockCartService },
        { provide: PaginationService, useValue: mockPaginationService }
      ]
    })
    .overrideComponent(HomePageComponent, {
      set: { imports: [], template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with loading state', () => {
    expect(component.isLoading()).toBeTrue();
    expect(component.hasError()).toBeFalse();
  });

  it('should toggle cart open state', () => {
    expect(component.isCartOpen()).toBeFalse();
    component.toggleCart();
    expect(component.isCartOpen()).toBeTrue();
    component.toggleCart();
    expect(component.isCartOpen()).toBeFalse();
  });

  it('should filter products by search term', () => {
    component.productosOriginal = [
      { title: 'Camiseta Azul' },
      { title: 'Pantalon Rojo' },
      { title: 'Camiseta Verde' }
    ];

    component.filtrarProductos('Camiseta');
    expect(component.productosFiltrados.length).toBe(2);

    component.filtrarProductos('Rojo');
    expect(component.productosFiltrados.length).toBe(1);

    component.filtrarProductos('Inexistente');
    expect(component.productosFiltrados.length).toBe(0);
  });

  it('should compute products grouped for masonry layout', () => {
    const mockProducts = [
      { id: '1', title: 'Product 1' },
      { id: '2', title: 'Product 2' },
      { id: '3', title: 'Product 3' },
      { id: '4', title: 'Product 4' }
    ] as any[];

    (component as any).productsResource = {
      value: () => ({ products: mockProducts })
    };

    const grouped = component.productsGroupedForMasonry();
    expect(grouped.length).toBe(2);
    expect(grouped[0].length).toBe(3);
    expect(grouped[1].length).toBe(1);
  });

  it('should return empty grouped products when resource has no value', () => {
    (component as any).productsResource = {
      value: () => null
    };

    expect(component.productsGroupedForMasonry()).toEqual([]);
  });
});
