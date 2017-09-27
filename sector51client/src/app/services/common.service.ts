import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Profile } from '../entities/profile';

@Injectable()
export class CommonService {
  public profile: Profile;
  public currentUser: BehaviorSubject<Profile>;
  public user: BehaviorSubject<Profile>;
  public sidenavVisible: boolean;

  constructor(public router: Router) {
    this.currentUser = new BehaviorSubject(null);
    this.user = new BehaviorSubject(null);
    router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        this.sidenavVisible = false;
      }
    });
  }

  get isLogin(): boolean {
    return this.router.url === '/login';
  }
}
