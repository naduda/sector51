import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { CommonService } from "./common.service";
import { HttpClient } from "@angular/common/http";
import { WebsocketService } from "../services/websocket.service";
import { Profile } from "../entities/profile";

@Injectable()
export class CanActivateAuthGuard implements CanActivate {

  constructor(private router: Router,
              private auth: AuthenticationService,
              private websocket: WebsocketService,
              private http: HttpClient,
              private common: CommonService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.token.length > 0) {
      const permited = this.hasPermitions(route, state);
      if (!permited) {
        this.router.navigate(['/']);
      }
      if (!this.common.currentUser) {
        this.http.get<Profile>('/api/profile/' + this.auth.username)
        .subscribe(profile => 
          this.http.get<any>('/api/getUserPermition?idUser=' + profile['created']).subscribe(permitions => {
            profile['permitions'] = permitions;
            this.common.currentUser = profile;
            this.common.user.next(this.common.currentUser);
            this.websocket.initWebSocket(this.auth.token);
        }));
      }
      return permited;
    }
    this.router.navigate(['/login']);
    return false;
  }

  private hasPermitions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url.endsWith('registration')) {
      return this.common.currentUser['permitions'].includes(2);
    }
    return true;
  }
}
