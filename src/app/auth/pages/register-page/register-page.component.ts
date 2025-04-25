import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from 'src/app/Utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {

  fb = inject(FormBuilder);
  formUtils = FormUtils;
  authService = inject(AuthService);
  router = inject(Router);

  hasError = signal(false);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, {
    validators: [this.matchPasswords('password', 'confirmPassword')]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.value;
    const { fullName = '', email = '', password = '' } = formData;
    this.authService.register(fullName!, email!, password!)
      .subscribe({
        next: (resp) => {
          this.registerForm.reset();
          if (resp === true) {
            this.router.navigateByUrl('/');
            return;
          }
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          // Manejo de errores aquí
           this.hasError.set(true);
           setTimeout(() => {
             this.hasError.set(false);
           }, 3000);
           this.registerForm.reset();
        }
      });
  }

  matchPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (formGroup: AbstractControl) => {
      const password = formGroup.get(passwordKey)?.value;
      const confirm = formGroup.get(confirmPasswordKey)?.value;
      if (password !== confirm) {
        formGroup.get(confirmPasswordKey)?.setErrors({ mismatch: true });
      } else {
        formGroup.get(confirmPasswordKey)?.setErrors(null);
      }
    };
  }
}
