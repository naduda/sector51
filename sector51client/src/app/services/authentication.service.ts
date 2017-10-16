import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { WebsocketService } from './websocket.service';
import { Profile } from '../entities/profile';

@Injectable()
export class AuthenticationService {

  constructor(private injector: Injector,
              private router: Router,
              private websoket: WebsocketService,
  ) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }

  login(username: string, password: string): Observable<boolean> {
    const http = this.injector.get(HttpClient);
    return http.post('/api/login', { username: username, password: password })
      .map((response: any) => {
        const token = response && response.token;
        if (token) {
          localStorage.setItem('currentUser', JSON.stringify({
            username: username,
            token: token
          }));
          return true;
        }
        return false;
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  get token(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    return token ? token : '';
  }

  get username(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const username = currentUser && currentUser.username;
    return username ? username : '';
  }

  logout(): void {
    this.websoket.disconnect();
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }
}
