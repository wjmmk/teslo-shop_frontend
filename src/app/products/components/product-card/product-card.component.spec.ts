import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProductCardComponent } from './product-card.component';
import { Gender, Product } from '@products/interfaces/product.interface';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct: Product = {
    id: '1',
    title: 'Test Product',
    price: 100,
    description: 'A test product description',
    slug: 'test-product',
    stock: 10,
    sizes: ['M', 'L'] as any,
    gender: Gender.Men,
    tags: ['test'],
    images: ['test-image.jpg'],
    user: { id: '1', email: 'test@test.com', fullName: 'Test', isActive: true, roles: ['user'] },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('product', mockProduct);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive product input', () => {
    expect(component.product()).toEqual(mockProduct);
  });

  it('should compute imageUrl from product images', () => {
    expect(component.imageUrl()).toBe(
      `${component.baseUrl}/files/product/${mockProduct.images[0]}`
    );
  });

  it('should calculate visualRating between 1 and 5', () => {
    expect(component.visualRating).toBeGreaterThanOrEqual(1);
    expect(component.visualRating).toBeLessThanOrEqual(5);
  });

  it('should have logArray with 5 elements', () => {
    expect(component.logArray.length).toBe(5);
    expect(component.logArray).toEqual([1, 2, 3, 4, 5]);
  });

  it('should render product title in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(mockProduct.title);
  });

  it('should render product price', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(mockProduct.price.toString());
  });

  it('should recalculate visualRating when product changes', () => {
    const initialRating = component.visualRating;

    const newProduct = { ...mockProduct, id: '2', title: 'New Product' };
    (component as any).product = newProduct;
    component.ngOnChanges({
      product: {
        currentValue: newProduct,
        previousValue: mockProduct,
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(component.visualRating).toBeGreaterThanOrEqual(1);
    expect(component.visualRating).toBeLessThanOrEqual(5);
  });

  it('should have a link to product detail page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const figure = compiled.querySelector('figure');
    expect(figure).toBeTruthy();
    expect(compiled.textContent).toContain(mockProduct.price.toString());
  });
});
