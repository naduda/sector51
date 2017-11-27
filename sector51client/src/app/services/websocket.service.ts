import { Injectable} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Profile } from '../entities/profile';

@Injectable()
export class WebsocketService {
  private ws: WebSocket;
  private http: HttpClient;

  constructor(private router: Router) {}

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  public initWebSocket(token: string, httpClient: HttpClient): void {
    this.http = httpClient;
    this.ws = new WebSocket('ws://localhost:8089/wsapi?token=' + token);

    this.ws.onopen = () => {
        console.log('Server Connected.');
    };

    this.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      console.log(data);
    };

    this.ws.onclose = () => {
      setTimeout(() => this.initWebSocket(token, this.http), 5000);
    };

    this.ws.onerror = (e) => {
      console.error(e);
    };
  }
}
