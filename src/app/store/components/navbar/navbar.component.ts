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

    // Solo aplicar en pantallas menores a 1024px (lg)
    const isMobile = window.innerWidth < 1024;
    const loginButton = document.getElementById('login');
    const registerButton = document.getElementById('register');
    const adminButton = document.getElementById('admin');
    const salirButton = document.getElementById('salir');

    if (isMobile) {
      if (this.isMenuOpen) {
        loginButton?.classList.add('hidden');
        registerButton?.classList.add('hidden');
        adminButton?.classList.add('hidden');
        salirButton?.classList.add('hidden');
      } else {
        //Aqui necesito que vuelva a mostrar los botones de login y register
        loginButton?.classList.remove('hidden');
        registerButton?.classList.remove('hidden');
        adminButton?.classList.remove('hidden');
        salirButton?.classList.remove('hidden');
      }
    } else {
      // En escritorio, asegurarse que siempre estén visibles
      loginButton?.classList.remove('hidden');
      registerButton?.classList.remove('hidden');
      adminButton?.classList.remove('hidden');
      salirButton?.classList.remove('hidden');
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    setTimeout(() => {
      const loginButton = document.getElementById('login');
      const registerButton = document.getElementById('register');

      const adminButton = document.getElementById('admin');
      const salirButton = document.getElementById('salir');

      loginButton?.classList.remove('hidden');
      registerButton?.classList.remove('hidden');

      adminButton?.classList.remove('hidden');
      salirButton?.classList.remove('hidden');
    }, 400); // Espera a que el menú se cierre antes de mostrar los botones
  }
}
