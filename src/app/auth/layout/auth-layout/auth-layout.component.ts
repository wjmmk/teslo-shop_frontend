import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../../store/components/navbar/navbar.component";
import { FooterComponent } from "../../../store/components/footer/footer.component";

@Component({
  selector: 'auth-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent { }
