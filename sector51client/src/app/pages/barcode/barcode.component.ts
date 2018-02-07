import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { IProduct, IBarcode, IModalWindow, IModalProperties, ERestResult } from '../../entities/common';
import { IResponse, RESERVED_PRODUCTS_ID, ERole, IUserService } from '../../entities/common';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { of } from 'rxjs/observable/of';
import { ModalService } from '../../services/modal.service';
import { REST_API } from '../../entities/rest-api';
import { element } from 'protractor';
import { inspect, isUndefined } from 'util';
import { Profile } from '../../entities/profile';
import { AbonementComponent } from '../modal/abonement/abonement.component';

@Component({
  selector: 'sector51-product',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements OnInit, IModalWindow {
  ready: boolean;
  header: string;
  products: IProduct[];
  types: IProduct[];
  product: IProduct;
  selders: Profile[];
  selder: Profile;
  barcode: string;
  isBuy: any;
  curCount: number;
  isEdit: boolean;
  isExist: boolean;
  isUser: boolean;
  someThingWrong: boolean;
  isVirtual: boolean;
  focusName: any = {};
  focusDesc: any = {};
  focusPrice = {
    onBlur: (element) => element.value = element.value ? Number(element.value).toFixed(2) : 0
  };

  private profile: Profile;
  private keyCodes: number[] = [13, 38, 40];

  constructor(public activeModal: NgbActiveModal,
              private modalService: ModalService,
              private http: HttpClient,
              public common: CommonService) {
    this.curCount = 1;
    this.isBuy = false;
    this.selder = new Profile(null, '-', '');
    this.selder['created'] = -1;
    this.selders = this.common.users.filter(u => u['roles'] === ERole[ERole.SELDER]);
    this.selders.unshift(this.selder);
  }

  ngOnInit(): void {
    this.http.get<IProduct[]>(REST_API.GET.products).catch(e => of(null))
      .do(products => this.setProducts(products))
      .flatMap(products => this.http.get<IBarcode>(REST_API.GET.barcodeByCode(this.barcode), {
        params: { productId: this.product.id.toString() }
      }))
      .flatMap((barcode: IBarcode) => barcode.productId === RESERVED_PRODUCTS_ID ?
        this.http.get<Profile>(REST_API.GET.userByCard(this.barcode)) : of(this.products.find(p => p.id === barcode.productId)))
      .subscribe(profile => this.onShown(profile), error => console.error(error));
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const isNumber = (event.target as any).nodeName === 'INPUT' && (event.target as any).type === 'number';
    if (!this.ready || !this.keyCodes.includes(event.keyCode)) return;
    if (!isNumber && !this.isExist && event.keyCode === 38) this.changeType(true);
    if (!isNumber && !this.isExist && event.keyCode === 40) this.changeType(false);
    if (event.keyCode !== 13) return;
    if (this.product.id !== 0) {
      this.activeModal.close(true);
    }
    if (this.product.name.length === 0) {
      this.focusField('name');
      return;
    }
    if (this.product.desc.length === 0) {
      this.focusField('desc');
      return;
    }
    if (isNaN(this.product.price)) {
      this.product.price = 0;
      this.focusField('price');
      return;
    }
    this.activeModal.close(true);
  }

  private changeType(up: boolean) {
    let index = this.types.indexOf(this.product);
    index += up ? -1 : 1;
    if (index < 0) index = this.types.length - 1;
    if (index > this.types.length - 1) index = 0;
    this.product = this.types[index];
  }

  private focusField(name: string) {
    if (name === 'name') this.focusName.eventEmitter.emit(true);
    if (name === 'desc') this.focusDesc.eventEmitter.emit(true);
  }

  private setProducts(products: IProduct[]): void {
    if (products) {
      this.products = products;
      this.types = products.filter(p => p.id === 0);
      this.types.push(products.find(p => p.id === RESERVED_PRODUCTS_ID));
      this.product = this.product || products.find(p => p.code === this.barcode) || products.find(p => p.id === 0);
    } else {
      this.activeModal.close();
      this.common.navigate('login');
    }
  }

  private onShown(profile: any) {
    if (profile && profile['created']) {
      this.profile = profile;
      this.product.name = profile.name;
      this.product.desc = profile.surname;
      this.product.price = profile.balance;
      this.product.code = profile.card;
      this.product['created'] = profile['created'];
      this.curCount = 0;
      this.isBuy = true;
      this.isExist = true;
    } else {
      this.isExist = profile && profile.id > 0;
      const existInCart = this.common.cartProducts
        .filter(p => p.id === this.product.id).reduce((r, c) => r + c.count, 0);
      this.someThingWrong = this.product.id > RESERVED_PRODUCTS_ID && this.product.count - existInCart <= 0;
      this.product.count -= existInCart;
      if (this.product.desc && this.product.desc !== '-') {
        const names = this.product.desc.split(' ');
        this.selder = this.selders.find(s => s.surname === names[0] && s.name === names[1]);
      }
      if (!this.selder) this.selder = this.selders[0];
      this.isBuy = !this.isExist;
    }
    this.product.price /= 100;
    if (this.product.id === RESERVED_PRODUCTS_ID) this.activeModal.close(true);
    this.header = this.isExist || this.isEdit ? this.product.name + ' ' + this.product.desc : 'unknownBarcode';
    this.ready = true;
  }

  private updateUserBalance() {
    this.profile.balance += this.curCount * 100;
    this.http.put(REST_API.PUT.user, this.profile).subscribe((response: IResponse) => {
      if (response && response.result === ERestResult[ERestResult.OK].toString()) {
        const user = this.common.users.find(u => this.profile.card === u.card);
        if (user) user.balance = this.profile.balance;
        this.common.navigate('main', { user: this.profile['created'] });
      } else {
        alert('Error');
      }
    });
  }

  private addProduct2database() {
    this.product.desc = this.selder['created'];
    this.http.post(REST_API.POST.product, this.product, { params: { code: this.barcode } })
      .subscribe((response: IResponse) => {
        if (response && response.result === ERestResult[ERestResult.OK].toString()) {
          this.common.newProduct.observers && this.common.newProduct.next(response.message);
          this.common.navigate('products');
        }
      });
  }

  private addUserCard2cart() {
    const user = Object.assign({}, this.product);
    const oldUser = this.common.cartProducts.find(p => p.id === user.id);
    if (oldUser) {
      this.common.cartProducts.splice(this.common.cartProducts.indexOf(oldUser), 1);
    }
    this.common.cartProducts.push(user);
  }

  private updateProduct() {
    this.product.desc = this.selder['created'];
    this.http.put(REST_API.PUT.product, this.product)
      .subscribe((response: IResponse) => {
        if (response && response.result === ERestResult[ERestResult.OK].toString()) {
          this.common.newProduct.next(response.message);
        }
      });
  }

  private addProduct2cart() {
    const addProduct = Object.assign({}, this.product);
    this.selder = this.selders.find(s => s['created'] === +this.product.desc);
    if (!this.selder) this.selder = this.selders[0];
    addProduct.desc = this.selder.surname + ' ' + this.selder.name;
    addProduct.count = this.curCount;
    this.common.cartProducts.push(addProduct);
    this.common.navigate('cart');
  }

  private openAbonement(userService: IUserService) {
    const props = {
      service: userService || this.common.services.find(s => s.id === 0),
      header: this.profile.surname + ' ' + this.profile.name,
      btOK: 'apply',
      btCancel: 'cancel',
      idUser: this.profile['created'],
      isUpdate: userService !== undefined
    };
    this.modalService.open(AbonementComponent, props);
  }

  btOkClick(instance: any): any {
    instance.isUser = instance.product.id === RESERVED_PRODUCTS_ID;
    instance.product.price *= 100;
    if (instance.isUser && instance.common.router.url === '/cart') {
      instance.addUserCard2cart();
    } else if (instance.isUser) {
      if (instance.isExist) {
        const url = REST_API.GET.userServices(instance.profile['created']);
        instance.http.get(url).subscribe((response: IResponse) => {
          const services = response.message;
          const abonementService = services.find(s => s.idService === 0);
          const dtBeg = abonementService ? abonementService.dtBeg : 0;
          const dtEnd = abonementService ? abonementService.dtEnd : 0;
          const now = new Date().getTime();
          if (dtBeg > now || now > dtEnd) {
            instance.openAbonement(abonementService);
          } else {
            instance.common.navigate('boxes', { code: instance.barcode });
          }
        });
      } else
        instance.common.navigate('registration', { code: instance.barcode });
    } else if (instance.product.id === 0) {
      instance.addProduct2database();
    } else if (instance.isExist) {
      if (instance.isBuy || instance.isEdit) {
        instance.product.count += instance.curCount;
        if (instance.product.id < RESERVED_PRODUCTS_ID) instance.product.count = 0;
        instance.updateProduct();
      } else if (instance.product.count < instance.curCount) {
        alert('Max cout is ' + instance.product.count);
      } else {
        instance.addProduct2cart();
      }
    }
  }

  btCancelClick(reason: any, instance: any) {
    instance.product.price *= 100;
  }

  init(props?: any) {
    this.isEdit = props.product !== undefined;
    if (!props) return;
    this.barcode = props.code || undefined;
    if (this.isEdit) {
      this.product = props.product;
      this.barcode = props.barcode;
      this.curCount = 0;
    }
  }
}
