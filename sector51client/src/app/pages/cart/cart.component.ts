import { Component, OnInit } from '@angular/core';
import { IProduct, RESERVED_PRODUCTS_ID, IResponse, ERestResult } from '../../entities/common';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Profile } from 'selenium-webdriver/firefox';
import { REST_API } from '../../entities/rest-api';

@Component({
  selector: 'sector51-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public userProduct: number;
  public cash: number;
  public isCancel: boolean;

  constructor(public common: CommonService, private http: HttpClient) { }

  ngOnInit() {
    this.userProduct = RESERVED_PRODUCTS_ID;
    this.cash = 0;
  }

  pay() {
    if (this.isCancel) {
      this.isCancel = false;
      return;
    }
    this.http.post(REST_API.POST.userPay, [
      this.user.code, this.products.reduce((r, c) => r + c.id + ':' + c.count + '_', ''), this.cash * 100
    ]).subscribe((response: IResponse) => {
      if (response && response.result === ERestResult[ERestResult.OK].toString()) {
        this.common.navigate('main', { user: this.user['created'] });
      } else {
        alert('Error');
      }
    });
  }

  clear() {
    this.common.cartProducts = [];
    this.isCancel = true;
  }

  get payFormula(): string {
    const cash = this.cash ? ' + ' + this.cash.toFixed(2) : '';
    return (this.user.price / 100).toFixed(2) + ' - ' + this.sum.toFixed(2) + cash +
      ' = ' + ((this.user.price / 100 - this.sum + this.cash).toFixed(2));
  }

  get sum(): number {
    return this.common.cartProducts
      .filter(p => p.id !== RESERVED_PRODUCTS_ID)
      .reduce((sum, p) => sum + p.count * p.price / 100, 0);
  }

  get products(): IProduct[] {
    const products = [];
    this.common.cartProducts.filter(p => p.id !== RESERVED_PRODUCTS_ID).forEach(p => products.push(Object.assign({}, p)));
    return products.reduce((newArray, curProduct) => {
        const exist = newArray.find(e => e.id === curProduct.id);
        if (exist && exist.count) {
          exist.count += curProduct.count;
        } else {
          newArray.push(curProduct);
        }
        return newArray;
      }, []);
  }

  get user(): IProduct {
    return this.common.cartProducts.find(p => p.id === RESERVED_PRODUCTS_ID);
  }

  get enaughtMony() {
    const balance = this.user ? this.user.price / 100 : 0;
    return balance + this.cash >= this.sum;
  }

  removeProduct(p: IProduct) {
    this.common.cartProducts = this.common.cartProducts.filter(e => e.id !== p.id);
  }
}
