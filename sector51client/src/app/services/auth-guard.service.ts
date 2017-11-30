import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Profile } from '../entities/profile';
import { IRole, ERole } from '../entities/common';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class CanActivateAuthGuard implements CanActivate {
  private iroles: IRole[];

  constructor(private router: Router,
              private auth: AuthenticationService,
              private http: HttpClient,
              private common: CommonService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.auth.token.length > 0) {
      if (this.common.profile && this.common.profile['permited'] !== undefined) {
        this.setPermissions(route, state, this.common.profile);
        if (state.url === '/' || state.url === '/main') {
          return true;
        }
        if (!this.common.profile['permited']) {
          this.router.navigate(['/']);
        }
        return this.common.profile['permited'];
      }
      return this.common.currentUser
        .flatMap(user => this.http.get<any[]>('/api/getRoles'))
        .do(pairs => this.iroles = pairs.map(pair => ({id: +pair['key'], name: pair['value']})))
        .flatMap(pairs => this.http.get<Profile>('/api/profile/' + this.auth.username))
        .do(user => of(this.setPermissions(route, state, user)))
        .map(user => {
          this.auth.initWebsocket(this.auth.token);
          this.common.profile = user;
          this.common.profile['iroles'] = this.iroles;
          if (!user['permited']) {
            this.router.navigate(['/']);
          }
          return user['permited'];
        })
        .catch(ex => {
          this.router.navigate(['/login']);
          return of(false);
        });
    }
    this.router.navigate(['/login']);
    return false;
  }

  private setPermissions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, user: Profile) {
    let authorities = user ? user['roles'] : false;
    authorities = authorities ? authorities.toLowerCase() : '';
    const mPermission = this.iroles.filter(r => authorities.includes(r.name.toLowerCase())).sort((a, b) => a.id - b.id)[0];
    user.role = +Object.keys(ERole).find(r => mPermission.id === +r);
    if (state.url.endsWith('registration')) {
      user['permited'] = mPermission.id <= ERole.ADMIN;
    }
    if (user['permited'] !== undefined) {
      return;
    }
    user['permited'] = true;
  }
}
