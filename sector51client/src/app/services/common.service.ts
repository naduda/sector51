import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Profile } from '../entities/profile';
import { STORAGE_NAME, IProduct, IRole, IService, IEvent } from '../entities/common';

@Injectable()
export class CommonService {
  users: Profile[];
  profile: Profile;
  services: IService[];
  events: IEvent[];
  currentUser: BehaviorSubject<Profile>;
  newProduct: BehaviorSubject<IProduct>;
  newBoxtype: BehaviorSubject<IRole>;
  sidenavVisible: boolean;
  cartProducts: IProduct[];

  constructor(public router: Router) {
    this.cartProducts = [];
    this.currentUser = new BehaviorSubject(null);
    this.newProduct = new BehaviorSubject(null);
    this.newBoxtype = new BehaviorSubject(null);
    router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        this.sidenavVisible = false;
      }
    });
  }

  get isLogin(): boolean {
    return this.router.url === '/login';
  }

  navigate(path: string, queryParams?: any) {
    this.router.navigate([path], { queryParams: queryParams || {} });
  }

  toStorage(key: string, value: any): void {
    const savedValue = this.fromStorage();
    if (value) {
      savedValue[key] = value;
    } else {
      delete savedValue[key];
    }
    localStorage.setItem(STORAGE_NAME, JSON.stringify(savedValue));
  }

  fromStorage(key?: string): any {
    const saved: string = localStorage.getItem(STORAGE_NAME) || '{}';
    const savedValue = JSON.parse(saved);
    return key ? savedValue[key] : savedValue;
  }
}
