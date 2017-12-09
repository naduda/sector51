import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct, ERestResult, RESERVED_PRODUCTS_ID } from '../../entities/common';
import { ModalService } from '../../services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../modal/modal.component';
import { BarcodeComponent } from '../barcode/barcode.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'sector51-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  public products: IProduct[];
  private readonly modalProperties = {
    header: '',
    headerClass: 'alert alert-danger',
    body: 'prompt.RemoveItemQuestion',
    btOK: 'apply',
    btCancel: 'cancel'
  };

  constructor(private http: HttpClient,
              private modalService: ModalService,
              private common: CommonService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.translate.get('attention').subscribe(value => this.modalProperties.header = value + '!');
    this.common.newProduct.subscribe(product => {
      this.http.get<IProduct[]>('/api/products')
        .subscribe(products => this.products = products.filter(p => p.id > RESERVED_PRODUCTS_ID));
    });
  }

  ngOnDestroy(): void {
    this.common.newProduct.unsubscribe();
  }

  removeProduct(product: IProduct) {
    this.modalService.open(ModalComponent, this.modalProperties, (result) => {
      this.http.delete('/api/removeProduct/' + product.id)
        .subscribe(r => r === ERestResult[ERestResult.OK] && this.products.splice(this.products.indexOf(product), 1));
    });
  }

  editProduct(product: IProduct) {
    this.modalService.open(BarcodeComponent, { product: product });
  }
}
