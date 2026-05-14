import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginPageComponent } from './login-page.component';
import { AuthService } from '@auth/services/auth.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate email field', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should validate password min length', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBeFalse();

    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should set hasError when form is invalid', fakeAsync(() => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onLogin();
    tick();

    expect(component.hasError()).toBeTrue();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  }));

  it('should clear hasError after 3 seconds', fakeAsync(() => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onLogin();
    expect(component.hasError()).toBeTrue();

    tick(3000);
    expect(component.hasError()).toBeFalse();
  }));

  it('should call authService.login on valid form', () => {
    authServiceMock.login.and.returnValue(of(true));
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password123',
    });
    component.onLogin();

    expect(authServiceMock.login).toHaveBeenCalledWith(
      'test@test.com',
      'password123'
    );
  });

  it('should navigate to home on successful login', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');
    authServiceMock.login.and.returnValue(of(true));
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password123',
    });
    component.onLogin();
    tick();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should set hasError on login failure', fakeAsync(() => {
    authServiceMock.login.and.returnValue(of(false));
    component.loginForm.setValue({
      email: 'test@test.com',
      password: 'password123',
    });
    component.onLogin();
    tick();

    expect(component.hasError()).toBeTrue();
  }));

  it('should reset form on login attempt', fakeAsync(() => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onLogin();
    tick();

    expect(component.loginForm.value).toEqual({
      email: null,
      password: null,
    });
  }));
});
