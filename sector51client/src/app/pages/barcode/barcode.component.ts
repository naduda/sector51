import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { IProduct, IBarcode, IModalWindow, IModalProperties, ERestResult, IResponse, RESERVED_PRODUCTS_ID } from '../../entities/common';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
import { of } from 'rxjs/observable/of';
import { ModalService } from '../../services/modal.service';
import { REST_API } from '../../entities/rest-api';
import { element } from 'protractor';
import { inspect } from 'util';
import { Profile } from '../../entities/profile';

@Component({
  selector: 'sector51-product',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements OnInit, IModalWindow {
  public ready: boolean;
  public header: string;
  public products: IProduct[];
  public types: IProduct[];
  public product: IProduct;
  public barcode: string;
  public isBuy: any;
  public curCount: number;
  public isEdit: boolean;
  public isExist: boolean;
  public isUser: boolean;
  public someThingWrong: boolean;
  public isVirtual: boolean;
  public focusName: any = {};
  public focusDesc: any = {};
  public focusPrice = {
    onBlur: (element) => element.value = element.value ? Number(element.value).toFixed(2) : 0
  };

  private profile: Profile;
  private keyCodes: number[] = [13, 38, 40];

  constructor(public activeModal: NgbActiveModal, private http: HttpClient, private common: CommonService) {
    this.curCount = 1;
    this.isBuy = false;
  }

  ngOnInit(): void {
    this.http.get<IProduct[]>(REST_API.GET.products).catch(e => of(null))
      .do(products => this.setProducts(products))
      .flatMap(products => this.http.get<IBarcode>(REST_API.GET.barcodeByCode(this.barcode), {
        params: { productId: this.product.id.toString() }
      }))
      .do(barcode => this.checkBarcode(barcode))
      .flatMap((barcode: IBarcode) => barcode.productId < 0 ?
        this.http.get<Profile>(REST_API.GET.userByCard(this.barcode)) : of(null))
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
      this.types = products.filter(p => p.id === 0 || p.id === RESERVED_PRODUCTS_ID);
      this.product = this.product || products.find(p => p.id === RESERVED_PRODUCTS_ID);
    } else {
      this.activeModal.close();
      this.common.navigate('login');
    }
  }

  private checkBarcode(barcode): void {
    const productId = barcode.productId < 0 ? +this.barcode === -1 ? 0 : RESERVED_PRODUCTS_ID : barcode.productId;
    this.isExist = barcode.productId > 0;
    if (!this.isEdit) this.product = this.products.find(p => p.id === productId);
  }

  private onShown(profile: Profile) {
    this.profile = profile;
    if (profile && profile['created']) {
      this.product.name = profile.name;
      this.product.desc = profile.surname;
      this.product.price = profile.balance;
      this.product.code = profile.card;
      this.product['created'] = profile['created'];
      this.curCount = 0;
      this.isBuy = true;
      this.isExist = true;
    } else {
      const existInCart = this.common.cartProducts
        .filter(p => p.id === this.product.id).reduce((r, c) => r + c.count, 0);
      this.someThingWrong = this.product.id > RESERVED_PRODUCTS_ID && this.product.count - existInCart <= 0;
      this.product.count -= existInCart;
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
    this.http.put(REST_API.PUT.product, this.product)
      .subscribe((response: IResponse) => {
        if (response && response.result === ERestResult[ERestResult.OK].toString()) {
          this.common.newProduct.next(response.message);
        }
      });
  }

  private addProduct2cart() {
    const addProduct = Object.assign({}, this.product);
    addProduct.count = this.curCount;
    this.common.cartProducts.push(addProduct);
    this.common.navigate('cart');
  }

  btOkClick(instance: any): any {
    instance.isUser = instance.product.id === RESERVED_PRODUCTS_ID;
    instance.product.price *= 100;
    if (instance.isUser) {
      instance.common.navigate(instance.isExist ? 'boxes' : 'registration', {
        code: instance.isExist ? instance.profile.card : instance.barcode
      });
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
    if (props.product) {
      this.product = props.product;
      this.barcode = props.barcode;
    }
  }
}
