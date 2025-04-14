import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '@store/components/footer/footer.component';

@Component({
  selector: 'app-about',
  imports: [FooterComponent],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent { }
