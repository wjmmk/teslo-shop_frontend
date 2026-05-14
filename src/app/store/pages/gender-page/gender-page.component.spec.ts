import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { GenderPageComponent } from './gender-page.component';
import { ProductsService } from '@products/services/products.service';
import { ProductsCartService } from '@products/services/products-cart.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';

describe('GenderPageComponent', () => {
  let component: GenderPageComponent;
  let fixture: ComponentFixture<GenderPageComponent>;
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
      imports: [GenderPageComponent],
      providers: [
        provideRouter([]),
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: ProductsCartService, useValue: mockCartService },
        { provide: PaginationService, useValue: mockPaginationService }
      ]
    })
    .overrideComponent(GenderPageComponent, {
      set: { imports: [], template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenderPageComponent);
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
});
