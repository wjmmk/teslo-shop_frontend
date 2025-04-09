import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@store/components/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './store-front-layout.component.html',
})
export class StoreFrontLayoutComponent { }
