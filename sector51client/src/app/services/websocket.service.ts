import { Injectable, Injector } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { CommonService } from "app/services/common.service";
import { Profile } from "app/entities/profile";

@Injectable()
export class WebsocketService {
  private ws: WebSocket;
  private http: HttpClient;

  constructor(private common: CommonService,
              private injector: Injector,
              private router: Router) {
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  public initWebSocket(token: string): void {
    this.http = this.injector.get(HttpClient);

    const wsURL = console.log(document.location.origin)
    this.ws = new WebSocket("ws://localhost:8089/counter?token=" + token);
    let div = document.getElementById('keys');
    this.ws.onopen = () => {
        console.log("FileServer Connected.");
        this.ws.send(this.common.currentUser.email);
		};
    this.ws.onmessage = (evt) => {
      const value: string = JSON.parse(evt.data).value;
      if (value.startsWith('user_')) {
        const key = value.substring(5);
        this.http.get<Profile>('/api/getUserByCard?card=' + key)
          .subscribe(data => {
            console.log(data);
            if(data) {
              this.router.navigate(['profile', data.login]);
            } else {
              this.router.navigate(['registration']);
            }
          });
      }
    };
    
    this.ws.onclose = function() {
				console.log("Connection is closed...");
		};
		this.ws.onerror = function(e) {
				console.log(e);
		}
  }
}
