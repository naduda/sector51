import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { CommonService } from "./common.service";

@Injectable()
export class CanActivateAuthGuard implements CanActivate {

  constructor(private router: Router,
              private auth: AuthenticationService,
              private common: CommonService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.token.length > 0) {
      const permited = this.hasPermitions(route, state);
      if (!permited) {
        this.router.navigate(['/']);
      }
      return permited;
    }
    this.router.navigate(['/login']);
    return false;
  }

  private hasPermitions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url.endsWith('registration')) {
      return this.common.currentUser['roles'].toLowerCase().includes('owner');
    }
    return true;
  }
}
