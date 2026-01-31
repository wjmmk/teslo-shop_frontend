import { Component, CUSTOM_ELEMENTS_SCHEMA, input, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';

// Import Swiper web component function
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-trending-carousel',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <swiper-container
      #swiper
      class="mySwiper pb-12"
      init="false" 
    >
      @for (product of products(); track product.id) {
        <swiper-slide class="h-auto">
           <product-card [product]="product" />
        </swiper-slide>
      }
    </swiper-container>
  `,
  styles: [`
    swiper-container {
      width: 100%;
      padding-top: 20px;
      padding-bottom: 50px;
    }

    swiper-slide {
      background-position: center;
      background-size: cover;
      width: 300px;
      height: auto;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None
})
export class TrendingCarouselComponent implements AfterViewInit {
  products = input.required<Product[]>();
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
    injectStyles: [`
      .swiper-pagination-bullet {
        background: #6366f1; /* Indigo-500 matching the theme primary */
        opacity: 0.5;
      }
      .swiper-pagination-bullet-active {
        opacity: 1;
        width: 20px;
        border-radius: 5px;
      }
    `],
  };

  ngAfterViewInit(): void {
    const swiperEl = this.swiper.nativeElement;
    Object.assign(swiperEl, this.swiperConfig);
    swiperEl.initialize();
  }
}
