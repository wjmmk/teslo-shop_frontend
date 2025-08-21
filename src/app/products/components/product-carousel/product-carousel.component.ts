import { AfterViewInit, Component, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

// import Swiper JS
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html'
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges {
  images = input.required<string[]>();

  swiperDiv = viewChild.required<ElementRef>('swiperDiv'); //Referencio un elemento del Html en el componente.

  swiper: Swiper | undefined = undefined; // Inicializo la variable swiper como indefinida.

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['images'].firstChange){ return; }

    if (!this.swiper) return;
    this.swiper.destroy(true, true); // Destruyo el swiper actual para volver a inicializarlo.

    // Controlando la paginacion de las imagenes.
    const paginationEl: HTMLDivElement = this.swiperDiv().nativeElement.querySelector('.swiper-pagination');
    paginationEl.innerHTML = '';

    setTimeout(() => {
      this.swiperInit();
    }, 100);
  }

  swiperInit() {
    const element = this.swiperDiv().nativeElement;
    if (!element) return;

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      // modules added
      modules: [ Navigation, Pagination],

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
      }
    });
  }
 }
