import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { of } from 'rxjs/observable/of';
import { ERole, IEvent, IRole, IService } from '../entities/common';
import { Profile } from '../entities/profile';
import { REST_API } from '../entities/rest-api';
import { AuthenticationService } from './authentication.service';
import { CommonService } from './common.service';

@Injectable()
export class CanActivateAuthGuard implements CanActivate {
  private iroles: IRole[];

  constructor(private auth: AuthenticationService,
    private http: HttpClient,
    private common: CommonService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.auth.initWebsocket(this.auth.token, this.http);

    if (this.auth.token.length > 0) {
      if (this.common.profile && this.common.profile['permited'] !== undefined) {
        this.setPermissions(route, state, this.common.profile);
        if (!this.common.profile['permited']) {
          this.common.router.navigate(['/']);
        }
        return this.common.profile['permited'];
      }
      return this.common.currentUser
        .flatMap(user => this.http.get<IEvent[]>(REST_API.GET.events))
        .do(events => this.common.events = events)
        .flatMap(events => this.http.get<any[]>(REST_API.GET.roles))
        .do(pairs => this.iroles = pairs.map(pair => ({ id: +pair['key'], name: pair['value'] })))
        .flatMap(pairs => this.http.get<Profile[]>(REST_API.GET.users))
        .do(users => this.common.users = users)
        .flatMap(users => this.http.get<IService[]>(REST_API.GET.services))
        .do(services => this.common.services = services)
        .flatMap(services => this.http.get<Profile>(REST_API.GET.profileByName(this.auth.username.replace(/\./g, ','))))
        .do(user => of(this.setPermissions(route, state, user)))
        .map(user => {
          this.common.profile = user;
          this.common.profile['iroles'] = this.iroles;
          if (!user['permited']) {
            this.common.router.navigate(['/']);
          }
          return user['permited'];
        })
        .catch(ex => {
          this.common.router.navigate(['/login']);
          return of(false);
        });
    } else if (location.href.endsWith('/registration?first=true')) {
      return this.http.get<boolean>(REST_API.GET.usersNotExist).catch(e => of(false));
    }
    this.common.router.navigate(['/login']);
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
