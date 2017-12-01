import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { WebsocketService } from './websocket.service';

@Injectable()
export class AuthenticationService {
  private http: HttpClient;

  constructor(private injector: Injector,
              private router: Router,
              private websocket: WebsocketService
  ) {}

  initWebsocket = (token: string) => this.websocket.initWebSocket(token, this.http);

  navigate(path: string) {
    this.router.navigate([path]);
  }

  login(username: string, password: string): Observable<boolean> {
    this.http = this.injector.get(HttpClient);
    return this.http.post('/api/login', { username: username, password: password })
      .map((response: any) => {
        const token = response && response.token;
        token && localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
        return token ? true : false;
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  get token(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    return token || '';
  }

  get username(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const username = currentUser && currentUser.username;
    return username || '';
  }

  logout(): void {
    this.websocket.disconnect();
    localStorage.removeItem('currentUser');
    this.router.navigate(['login']);
  }
}
