import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
    selector: 'front-navbar',
    imports: [RouterLink, RouterLinkActive, CommonModule],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authServices = inject(AuthService);
  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Como ocultar los botones del navbar.
    const loginButton = document.getElementById('login');
    const registerButton = document.getElementById('register');
    const userButton = document.getElementById('user');
    const salirButton = document.getElementById('salir');
    const adminButton = document.getElementById('admin');

    if (this.isMenuOpen) {
      loginButton?.classList.add('hidden');
      registerButton?.classList.add('hidden');
      userButton?.classList.add('hidden');
      salirButton?.classList.add('hidden');
      adminButton?.classList.add('hidden');
    } else {
      loginButton?.classList.remove('hidden');
      registerButton?.classList.remove('hidden');
      userButton?.classList.remove('hidden');
      salirButton?.classList.remove('hidden');
      adminButton?.classList.remove('hidden');
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
