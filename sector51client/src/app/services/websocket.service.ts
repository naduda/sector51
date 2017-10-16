import { Injectable, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Profile } from '../entities/profile';

@Injectable()
export class WebsocketService implements OnInit {
  private ws: WebSocket;
  private http: HttpClient;

  constructor(private injector: Injector, private router: Router) {}

  ngOnInit(): void {
    this.http = this.injector.get(HttpClient);
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  public initWebSocket(token: string, user: Profile): void {
    this.ws = new WebSocket('ws://localhost:8089/wsapi?token=' + token);

    this.ws.onopen = () => {
        console.log('FileServer Connected.');
        this.ws.send(user.email);
    };

    this.ws.onmessage = (evt) => {
      const value: string = JSON.parse(evt.data).value;
      if (value.startsWith('user_')) {
        const key = value.substring(5);
        this.http.get<Profile>('/api/getUserByCard?card=' + key)
          .subscribe(data => {
            console.log(data);
            if (data) {
              this.router.navigate(['profile', data.login]);
            } else {
              this.router.navigate(['registration']);
            }
          });
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.initWebSocket(token, user), 5000);
    };

    this.ws.onerror = (e) => {
      console.error(e);
    };
  }
}
