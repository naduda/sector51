import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Profile } from '../entities/profile';
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class CommonService {
  public currentUser: Profile;
  public user: BehaviorSubject<Profile>;
  public sidenavVisible: boolean;

  constructor(public router: Router, 
              private auth: AuthenticationService) {
    this.user = new BehaviorSubject(null);
    router.events.subscribe(val => {
      if(val instanceof NavigationStart) {
        this.sidenavVisible = false;
      }
    });
  }

  get isLogin(): boolean {
    return this.router.url === '/login';
  }

  // get currentUser(): Profile {
  //   if (this._currentUser) {
  //     return this._currentUser;
  //   } else {
  //     this.http.get<Profile>('/api/profile/' + this.auth.username)
  //     .flatMap(profile => this.http.get<any>('/api/getUserPermition?idUser=' + profile['created']))
  //     .subscribe(profile => {
  //       console.log(profile)
  //       this._currentUser = profile;
  //       this.websocket.initWebSocket(this.auth.token);
  //       return profile;
  //     });
  //   }
  // }
}
