import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@store/components/navbar/navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";


@Component({
    selector: 'app-store-front-layout',
    imports: [RouterOutlet, NavbarComponent, FooterComponent],
    templateUrl: './store-front-layout.component.html'
})
export class StoreFrontLayoutComponent { }
