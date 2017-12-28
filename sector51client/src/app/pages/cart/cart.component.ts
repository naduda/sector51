import { Component, OnInit } from '@angular/core';
import { IProduct, RESERVED_PRODUCTS_ID } from '../../entities/common';
import { CommonService } from '../../services/common.service';
import { HttpClient } from '@angular/common/http';
import { Profile } from 'selenium-webdriver/firefox';

@Component({
  selector: 'sector51-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public userProduct: number;
  public cash: number;

  constructor(private common: CommonService, private http: HttpClient) { }

  ngOnInit() {
    this.userProduct = RESERVED_PRODUCTS_ID;
    this.cash = 0;
  }

  pay() {
    console.log(this.cash);
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

  get products() {
    return this.common.cartProducts.filter(p => p.id !== RESERVED_PRODUCTS_ID);
  }

  get user(): IProduct {
    return this.common.cartProducts.find(p => p.id === RESERVED_PRODUCTS_ID);
  }

  get enaughtMony() {
    const balance = this.user ? this.user.price / 100 : 0;
    return balance + this.cash >= this.sum;
  }
}
