import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';

const baseUrl = environment.baseUrl;

describe('AuthService', () => {
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: '1', email: 'test@test.com', fullName: 'Test User',
    isActive: true, roles: ['user'],
  };

  const mockAdminUser: User = {
    id: '2', email: 'admin@test.com', fullName: 'Admin User',
    isActive: true, roles: ['admin', 'user'],
  };

  const mockAuthResponse: AuthResponse = { user: mockUser, token: 'valid-token' };

  function configureTestingModule() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock?.verify();
  });

  it('should be created', fakeAsync(() => {
    localStorage.clear();
    configureTestingModule();
    const service = TestBed.inject(AuthService);
    tick();
    expect(service).toBeTruthy();
    expect(service.authStatus()).toBe('not-authenticated');
  }));

  describe('initial state', () => {
    it('should have not-authenticated status when no token', fakeAsync(() => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      flushMicrotasks();
      expect(service.authStatus()).toBe('not-authenticated');
    }));

    it('should have null user and token initially', () => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      expect(service.user()).toBeNull();
      expect(service.token()).toBeNull();
      expect(service.isAdmin()).toBeFalse();
    });
  });

  describe('login()', () => {
    it('should login successfully and update state', fakeAsync(() => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      flushMicrotasks();

      let result: boolean | undefined;
      service.login('test@test.com', 'password').subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@test.com', password: 'password' });
      req.flush(mockAuthResponse);

      expect(result).toBeTrue();
      expect(service.authStatus()).toBe('authenticated');
      expect(service.user()).toEqual(mockUser);
      expect(service.token()).toBe('valid-token');
    }));

    it('should handle login failure', fakeAsync(() => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      flushMicrotasks();

      let result: boolean | undefined;
      service.login('wrong@test.com', 'wrong').subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(result).toBeFalse();
      expect(service.authStatus()).toBe('not-authenticated');
      expect(service.user()).toBeNull();
      expect(service.token()).toBeNull();
    }));
  });

  describe('register()', () => {
    it('should register successfully and update state', fakeAsync(() => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      flushMicrotasks();

      let result: boolean | undefined;
      service.register('New User', 'new@test.com', 'password').subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        fullName: 'New User', email: 'new@test.com', password: 'password',
      });
      req.flush(mockAuthResponse);

      expect(result).toBeTrue();
      expect(service.authStatus()).toBe('authenticated');
      expect(service.user()).toEqual(mockUser);
      expect(service.token()).toBe('valid-token');
    }));

    it('should handle register failure', fakeAsync(() => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      flushMicrotasks();

      let result: boolean | undefined;
      service.register('', '', '').subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/register`);
      req.flush('Bad request', { status: 400, statusText: 'Bad Request' });

      expect(result).toBeFalse();
      expect(service.authStatus()).toBe('not-authenticated');
    }));
  });

  describe('checkStatus()', () => {
    it('should return false and logout when no token', fakeAsync(() => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      flushMicrotasks();

      service.checkStatus().subscribe((result) => {
        expect(result).toBeFalse();
      });

      expect(service.authStatus()).toBe('not-authenticated');
      expect(service.user()).toBeNull();
    }));

    it('should check status with valid token', fakeAsync(() => {
      localStorage.setItem('token', 'existing-token');
      configureTestingModule();
      const service = TestBed.inject(AuthService);

      const req = httpMock.expectOne(`${baseUrl}/auth/check-status`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAuthResponse);

      flushMicrotasks();

      expect(service.authStatus()).toBe('authenticated');
      expect(service.user()).toEqual(mockUser);
      expect(service.token()).toBe('valid-token');
    }));

    it('should handle check-status HTTP failure', fakeAsync(() => {
      localStorage.setItem('token', 'expired-token');
      configureTestingModule();
      const service = TestBed.inject(AuthService);

      const req = httpMock.expectOne(`${baseUrl}/auth/check-status`);
      req.flush('Token expired', { status: 401, statusText: 'Unauthorized' });

      flushMicrotasks();

      expect(service.authStatus()).toBe('not-authenticated');
      expect(service.user()).toBeNull();
      expect(service.token()).toBeNull();
    }));
  });

  describe('logout()', () => {
    it('should clear all auth state', fakeAsync(() => {
      localStorage.setItem('token', 'some-token');
      configureTestingModule();
      const service = TestBed.inject(AuthService);

      const req = httpMock.expectOne(`${baseUrl}/auth/check-status`);
      req.flush(mockAuthResponse);
      flushMicrotasks();

      service.logout();

      expect(service.authStatus()).toBe('not-authenticated');
      expect(service.user()).toBeNull();
      expect(service.token()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    }));
  });

  describe('isAdmin', () => {
    it('should return true for admin users', fakeAsync(() => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      flushMicrotasks();

      service.login('admin@test.com', 'password').subscribe();
      const req = httpMock.expectOne(`${baseUrl}/auth/login`);
      req.flush({ user: mockAdminUser, token: 'admin-token' });

      expect(service.isAdmin()).toBeTrue();
    }));

    it('should return false for regular users', fakeAsync(() => {
      localStorage.clear();
      configureTestingModule();
      const service = TestBed.inject(AuthService);
      flushMicrotasks();

      service.login('test@test.com', 'password').subscribe();
      const req = httpMock.expectOne(`${baseUrl}/auth/login`);
      req.flush(mockAuthResponse);

      expect(service.isAdmin()).toBeFalse();
    }));
  });
});
