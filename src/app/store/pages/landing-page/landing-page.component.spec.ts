import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LandingPageComponent } from './landing-page.component';
import { ProductsService } from '@products/services/products.service';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let productsServiceMock: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    productsServiceMock = jasmine.createSpyObj('ProductsService', ['getAllProducts']);
    productsServiceMock.getAllProducts.and.returnValue(of({ count: 0, pages: 0, products: [] }));

    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [
        provideRouter([]),
        { provide: ProductsService, useValue: productsServiceMock }
      ]
    })
    .overrideComponent(LandingPageComponent, {
      set: { imports: [], template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject ProductsService', () => {
    expect(component.productsService).toBeTruthy();
  });
});
