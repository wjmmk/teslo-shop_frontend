import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { StoreFrontLayoutComponent } from './store-front-layout.component';

describe('StoreFrontLayoutComponent', () => {
  let component: StoreFrontLayoutComponent;
  let fixture: ComponentFixture<StoreFrontLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreFrontLayoutComponent],
      providers: [provideRouter([])]
    })
    .overrideComponent(StoreFrontLayoutComponent, {
      set: { imports: [], template: '' }
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreFrontLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
