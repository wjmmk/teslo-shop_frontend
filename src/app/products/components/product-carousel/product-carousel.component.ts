import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-omage.pipe';

// import Swiper JS
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles: `
    .swiper {
      width: 100%;
      height:500px;
    }
  `
})
export class ProductCarouselComponent implements AfterViewInit {
  images = input.required<string[]>();

  swiperDiv = viewChild.required<ElementRef>('swiperDiv'); //Referencio un elemento del Html en el componente.

  ngAfterViewInit(): void {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    const swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },

      // modules added
      modules: [
        Navigation, Pagination
      ]
    });
  }
 }
