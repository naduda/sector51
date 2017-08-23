import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class CanActivateAuthGuard implements CanActivate {

  constructor(private router: Router,
              private auth: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.token.length > 0) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
