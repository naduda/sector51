import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { REST_API } from '../entities/rest-api';
import { CommonService } from './common.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class AuthenticationService {
  private http: HttpClient;

  constructor(public common: CommonService,
    private injector: Injector,
    private websocket: WebsocketService
  ) { }

  initWebsocket = (token: string, http?: HttpClient) => this.websocket.initWebSocket(token, http || this.http);

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
