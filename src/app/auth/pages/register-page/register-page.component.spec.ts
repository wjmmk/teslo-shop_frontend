import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegisterPageComponent } from './register-page.component';
import { AuthService } from '@auth/services/auth.service';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should validate fullName required', () => {
    const nameControl = component.registerForm.get('fullName');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalse();

    nameControl?.setValue('John');
    expect(nameControl?.valid).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('not-an-email');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should validate password min length', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBeFalse();

    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should validate confirmPassword is required', () => {
    const confirmControl = component.registerForm.get('confirmPassword');
    confirmControl?.setValue('');
    expect(confirmControl?.valid).toBeFalse();

    confirmControl?.setValue('somepassword');
    expect(confirmControl?.valid).toBeTrue();
  });

  it('should mark all fields as touched on invalid submit', () => {
    component.onSubmit();

    expect(component.registerForm.get('fullName')?.touched).toBeTrue();
    expect(component.registerForm.get('email')?.touched).toBeTrue();
    expect(component.registerForm.get('password')?.touched).toBeTrue();
    expect(component.registerForm.get('confirmPassword')?.touched).toBeTrue();
  });

  it('should not call authService when form is invalid', () => {
    component.onSubmit();
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call authService.register on valid form', () => {
    authServiceMock.register.and.returnValue(of(true));
    component.registerForm.setValue({
      fullName: 'John Doe',
      email: 'john@test.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith(
      'John Doe',
      'john@test.com',
      'password123'
    );
  });

  it('should navigate to home on successful registration', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');
    authServiceMock.register.and.returnValue(of(true));
    component.registerForm.setValue({
      fullName: 'John Doe',
      email: 'john@test.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    component.onSubmit();
    tick();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should set hasError on registration failure', fakeAsync(() => {
    authServiceMock.register.and.returnValue(
      throwError(() => new Error('Registration failed'))
    );
    component.registerForm.setValue({
      fullName: 'John Doe',
      email: 'john@test.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    component.onSubmit();
    tick();

    expect(component.hasError()).toBeTrue();
  }));

  describe('matchPasswords validator', () => {
    it('should set mismatch error when passwords do not match', () => {
      component.registerForm.setValue({
        fullName: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'different',
      });

      const confirmControl = component.registerForm.get('confirmPassword');
      expect(confirmControl?.errors).toEqual({ mismatch: true });
    });

    it('should not have mismatch error when passwords match', () => {
      component.registerForm.setValue({
        fullName: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      const confirmControl = component.registerForm.get('confirmPassword');
      expect(confirmControl?.errors).toBeNull();
    });
  });
});
