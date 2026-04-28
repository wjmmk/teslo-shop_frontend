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
      class="mySwiper pb-12 overflow-visible"
      init="false"
    >
      @for (product of products(); track product.id) {
        <swiper-slide class="h-auto p-2 overflow-visible">
           <div class="trending-card-wrapper group">
             <product-card [product]="product" class="block h-full transition-all duration-500 rounded-2xl overflow-hidden" />
           </div>
        </swiper-slide>
      }
    </swiper-container>
  `,

  styles: [`
    :host {
      display: block;
      width: calc(100% + 20px);
      margin-left: -10px;
      overflow: visible;
    }

    swiper-container {
      width: 100%;
      padding-top: 20px;
      padding-bottom: 50px;
      overflow: visible;
    }

    swiper-slide {
      width: 308px;
      height: auto;
      transition: transform 0.5s ease;
      overflow: visible;
    }

    .trending-card-wrapper {
      position: relative;
      border-radius: 1rem;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
    }
    
    .trending-card-wrapper::after {
      content: '';
      position: absolute;
      inset: -4px;
      background: linear-gradient(45deg, #6366f1, #ec4899, #6366f1);
      z-index: -1;
      border-radius: 1.25rem;
      opacity: 0;
      transition: opacity 0.5s ease;
      filter: blur(15px);
    }
    
    .trending-card-wrapper:hover {
      transform: translateY(-1px) scale(1.03);
    }

    .trending-card-wrapper:hover::after {
      opacity: 0.5;
    }

    /* Target the image inside product-card for a zoom effect */
    .trending-card-wrapper:hover img {
      transform: scale(1.1);
    }

    product-card img {
      transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    /* Target the card body for a slight color shift */
    .trending-card-wrapper:hover .card-body {
      background-color: rgba(15, 23, 42, 0.9) !important; /* Slightly lighter slate */
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
    watchSlidesProgress: true,
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
        spaceBetween: 25,
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
