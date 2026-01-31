import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TrendingCarouselComponent } from './components/trending-carousel/trending-carousel.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, TrendingCarouselComponent],
  templateUrl: './landing-page.component.html',
  styles: [`
    :host {
      display: block;
      position: relative;
    }
    .hero-bg {
      background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/assets/images/Mens Cybercab Tee-2.jpeg');
      background-size: cover;
      background-position: center;
    }
    .landing-container {
      position: relative;
      min-height: 100vh;
      overflow: hidden;
      background: transparent;
    }
  `]
})
export class LandingPageComponent {
  productsService = inject(ProductsService);

  readonly productsResource = rxResource({
    loader: () => {
      // Fetch more products to make the carousel interesting (e.g., 8 instead of 4)
      return timer(0).pipe(
        switchMap(() => this.productsService.getAllProducts({ limit: 8, offset: 0 }))
      );
    }
  });
}
