import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { WebsocketService } from './websocket.service';
import { CommonService } from './common.service';
import { REST_API } from '../entities/rest-api';

@Injectable()
export class AuthenticationService {
  private http: HttpClient;

  constructor(public common: CommonService,
              private injector: Injector,
              private websocket: WebsocketService
  ) {}

  initWebsocket = (token: string) => this.websocket.initWebSocket(token, this.http);

  login(username: string, password: string): Observable<boolean> {
    this.http = this.injector.get(HttpClient);
    return this.http.post(REST_API.POST.login, { username: username, password: password })
      .map((response: any) => {
        const token = response && response.token;
        token && this.common.toStorage('currentUser', { username: username, token: token });
        return token ? true : false;
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  get token(): string {
    const currentUser = this.common.fromStorage('currentUser');
    const token = currentUser && currentUser.token;
    return token || '';
  }

  get username(): string {
    const currentUser = this.common.fromStorage('currentUser');
    const username = currentUser && currentUser.username;
    return username || '';
  }

  logout(): void {
    this.websocket.disconnect();
    this.common.toStorage('currentUser', undefined);
  }
}
