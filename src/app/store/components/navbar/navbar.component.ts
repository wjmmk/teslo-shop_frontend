import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";

@Component({
    selector: 'front-navbar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent { }
