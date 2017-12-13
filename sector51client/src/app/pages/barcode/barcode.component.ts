import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'sector51-product',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements OnInit, IModalWindow {
  public ready: boolean;
  public header: string;
  public headerClass: string;
  public btOk: string;
  public products: IProduct[];
  public product: IProduct;
  public newProduct: IProduct;
  public barcode: string;
  public isEdit: boolean;

  constructor(public activeModal: NgbActiveModal, private http: HttpClient, public common: CommonService) {
    this.newProduct = { id: -1, name: '', desc: '-', price: 0 };
  }

  ngOnInit(): void {
    this.http.get<IProduct[]>(REST_API.GET.products).catch(e => of(null))
      .do(products => {
        this.isEdit = this.product !== undefined;
        if (products) {
          this.products = products;
          this.newProduct = this.product || this.newProduct;
          this.newProduct.price /= 100;
          this.product = this.product || products[1];
        } else {
          this.activeModal.close();
          this.common.navigate('login');
        }
      })
      .flatMap(products => products && this.http.get<IBarcode>(REST_API.GET.barcodeByCode(this.barcode), {
        params: { productId: this.product.id.toString() }
      }))
      .do((barcode: IBarcode) => {
        const exist: boolean = barcode.productId > RESERVED_PRODUCTS_ID;
        const productId = barcode.productId < 0 ? RESERVED_PRODUCTS_ID : barcode.productId;
        this.headerClass = exist ? 'bg-info' : 'bg-warning';
        this.btOk = exist ? 'apply' : 'add';
        this.product = this.products.find(p => p.id === productId);
        this.header = exist ? this.product.name + ' ' + this.product.desc : 'unknownBarcode';
        if (!this.barcode) this.barcode = exist ? barcode.code : '';
      })
      .flatMap((barcode: IBarcode) => barcode.productId < 0 ?
        of(undefined) : this.http.get<any>(REST_API.GET.userByCard(barcode.code)))
      .subscribe(data => {
        if (data && data.created) this.header = data.surname + ' ' + data.name;
        this.ready = true;
      }, error => console.error(error));
  }

  btOkClick(props: any): any {
    const _instance = props.instance as BarcodeComponent;
    if (_instance.isEdit) {
      _instance.newProduct.price = _instance.newProduct.price * 100;
      _instance.http.put(REST_API.PUT.product, _instance.newProduct, {
        params: { code: '', oldProductId: '' }
      }).subscribe((response: IResponse) => {
          if (response && response.result === ERestResult[ERestResult.OK].toString()) {
            _instance.common.newProduct.next(response.message);
          }
        });
      return;
    }
    if (_instance.product.id === RESERVED_PRODUCTS_ID) {
      _instance.common.navigate('registration', { code: props.code });
    } else if (_instance.product.id === 0) {
      _instance.newProduct.price = _instance.newProduct.price * 100;
      _instance.http.post(REST_API.POST.product, _instance.newProduct, { params: { code: props.code } })
        .subscribe((response: IResponse) => {
          if (response && response.result === ERestResult[ERestResult.OK].toString()) {
            _instance.common.newProduct.observers && _instance.common.newProduct.next(response.message);
            _instance.common.navigate('products');
          }
        });
    } else {
      _instance.http.put(REST_API.PUT.product, _instance.newProduct, {
        params: { code: props.code, oldProductId: _instance.product.id.toString() }
      }).subscribe((response: IResponse) => {
          if (response && response.result === ERestResult[ERestResult.OK].toString()) {
            _instance.common.newProduct.observers && _instance.common.newProduct.next(response.message);
            _instance.common.navigate('products');
          }
        });
    }
  }

  btCancelClick(reason: any) {}

  init(props?: any) {
    if (!props) return;
    this.barcode = props.code || undefined;
    if (props.product) {
      this.product = props.product;
      this.barcode = props.barcode;
    }
  }
}
