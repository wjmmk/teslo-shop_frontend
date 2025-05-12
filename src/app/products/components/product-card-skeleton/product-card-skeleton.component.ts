import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'product-card-skeleton',
  imports: [],
  templateUrl: './product-card-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardSkeletonComponent { }
