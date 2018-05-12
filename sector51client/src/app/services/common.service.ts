import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EConfirmType, IEvent, IProduct, IService, STORAGE_NAME } from '../entities/common';
import { Profile } from '../entities/profile';

@Injectable()
export class CommonService {
  users: Profile[];
  profile: Profile;
  services: IService[];
  events: IEvent[];
  currentUser: BehaviorSubject<Profile>;
  newProduct: BehaviorSubject<IProduct>;
  sidenavVisible: boolean;
  cartProducts: IProduct[];

  constructor(public router: Router, private confirmationService: ConfirmationService) {
    this.cartProducts = [];
    this.currentUser = new BehaviorSubject(null);
    this.newProduct = new BehaviorSubject(null);
    router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        this.sidenavVisible = false;
      }
    });
  }

  confirm(confirmation): ConfirmationService {
    confirmation.rejectVisible = confirmation.type !== EConfirmType.YES;
    return this.confirmationService.confirm(confirmation);
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
