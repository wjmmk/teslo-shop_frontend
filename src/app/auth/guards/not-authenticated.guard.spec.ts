import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment } from '@angular/router';
import { of } from 'rxjs';

import { NotAuthenticatedGuard } from './not-authenticated.guard';
import { AuthService } from '@auth/services/auth.service';

describe('NotAuthenticatedGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['checkStatus']);
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('should allow access when user is not authenticated', async () => {
    authServiceMock.checkStatus.and.returnValue(of(false));

    const result = await TestBed.runInInjectionContext(() => {
      return NotAuthenticatedGuard({} as Route, [] as UrlSegment[]) as Promise<boolean>;
    });

    expect(result).toBeTrue();
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is authenticated', async () => {
    authServiceMock.checkStatus.and.returnValue(of(true));

    const result = await TestBed.runInInjectionContext(() => {
      return NotAuthenticatedGuard({} as Route, [] as UrlSegment[]) as Promise<boolean>;
    });

    expect(result).toBeFalse();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/auth/login');
  });
});
