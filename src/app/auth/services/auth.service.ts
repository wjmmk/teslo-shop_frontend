import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { environment } from '@environments/environment';
import { rxResource } from '@angular/core/rxjs-interop';


type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  constructor(private readonly http: HttpClient) { }

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  })

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    return this._user() ? 'authenticated' : 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, { email, password })
    .pipe(
      tap(({ user, token }) => this.handleAuthSuccess({ user, token })),
      map(() => true),
      catchError((err: any) => this.handleAuthError(err))
    );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token) return of(false);

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`)
    .pipe(
      tap(({ user, token }) => this.handleAuthSuccess({ user, token })),
      map(() => true),
      catchError((err: any) => this.handleAuthError(err))
    );
  }

  logout(): void {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }

  private handleAuthSuccess({user, token}: AuthResponse): void {
    this._user.set(user);
    this._token.set(token);
    this._authStatus.set('authenticated');
    localStorage.setItem('token', token);
  }

  private handleAuthError(err: any): Observable<boolean>{
    this.logout();
    return of(false);
  }
}
