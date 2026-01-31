import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './landing-page.component.html',
  styles: [`
    :host {
      display: block;
    }
    .hero-bg {
      background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/assets/images/Mens Cybercab Tee-2.jpeg');
      background-size: cover;
      background-position: center;
    }
  `]
})
export class LandingPageComponent {
  productsService = inject(ProductsService);

  readonly productsResource = rxResource({
    loader: () => {
      return timer(0).pipe(
        switchMap(() => this.productsService.getAllProducts({ limit: 4, offset: 0 }))
      );
    }
  });
}
