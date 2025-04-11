import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shared-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  pages = input(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage); // Esta es una señal que depende de otra para ser manejada en la vista.

  getPageList = computed( () => {
    return Array.from({ length: this.pages()}, (_, i) => i + 1);
  });
}
