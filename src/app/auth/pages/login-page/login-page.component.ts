import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from 'src/app/Utils/form-utils';

@Component({
  selector: 'login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  formUtils = FormUtils;
  authService = inject(AuthService);
  router = inject(Router);

  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  onLogin() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      this.loginForm.reset();
      setTimeout(() => {
        this.hasError.set(false);
      }, 3000);
      return;
    }
   // console.log(this.loginForm.value);
    const { email = '', password } = this.loginForm.value;
    this.authService.login(email!, password!)
      .subscribe({
        next: (resp) => {
          //console.log(resp);
          this.isPosting.set(false);
          this.loginForm.reset();

          if(resp === true) {
            this.router.navigateByUrl('/');
            return;
          }
          // Aqui se maneja el error y se muestrar un mensaje al usuario
          this.hasError.set(true);
          setTimeout(() => {
            this.hasError.set(false);
          }, 3000);
        }
      });
  }
}
