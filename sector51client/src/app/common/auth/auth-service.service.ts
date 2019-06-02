import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AUTH_CONST, IAuthUser } from './auth-constant';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject = new BehaviorSubject<IAuthUser>(JSON.parse(this.getTokenFromStorage()));
  public currentUser: Observable<IAuthUser>;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IAuthUser {
    return this.currentUserSubject.value;
  }

  signup(name: string, password: string): Observable<object> {
    return this.http.post('auth/signup', { name, password });
  }

  login(name: string, password: string): Observable<object> {
    return this.http.post<IAuthUser>('/login', { name, password })
      .pipe(
        map(user => {
          if (user && user.token) {
            this.storageToken(JSON.stringify(user));
            this.currentUserSubject.next(user);
          }

          return user;
        }),
        tap(() => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        })
      );
  }

  logout() {
    this.storageToken(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['login'], { queryParams: { returnUrl: '/' } });
  }

  private storageToken(value: string): void {
    const savedValue = this.getStoredItem();
    if (value) {
      savedValue['currentUser'] = value;
    } else {
      delete savedValue['currentUser'];
    }
    localStorage.setItem(AUTH_CONST.STORAGE_NAME, JSON.stringify(savedValue));
  }

  private getStoredItem() {
    const saved: string = localStorage.getItem(AUTH_CONST.STORAGE_NAME) || '{}';
    return JSON.parse(saved);
  }

  private getTokenFromStorage(): string {
    const savedValue = this.getStoredItem();
    return savedValue['currentUser'] || null;
  }
}
