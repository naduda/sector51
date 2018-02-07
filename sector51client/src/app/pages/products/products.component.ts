import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct, ERestResult, RESERVED_PRODUCTS_ID, ERole } from '../../entities/common';
import { ModalService } from '../../services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalComponent } from '../modal/modal.component';
import { BarcodeComponent } from '../barcode/barcode.component';
import { CommonService } from '../../services/common.service';
import { REST_API } from '../../entities/rest-api';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'sector51-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  public products: IProduct[];
  public permissions: boolean;
  private subscription: Subscription;
  private readonly modalProperties = {
    header: '',
    headerClass: 'alert alert-danger',
    body: 'prompt.RemoveItemQuestion',
    btOK: 'apply',
    btCancel: 'cancel'
  };

  constructor(private http: HttpClient,
              private modalService: ModalService,
              private common: CommonService) { }

  ngOnInit() {
    this.permissions = this.common.profile.role < ERole.USER;
    this.subscription = this.common.newProduct.subscribe(product => {
      this.http.get<IProduct[]>(REST_API.GET.products).subscribe(products =>
        this.products = products.filter(p => p.id !== 0 && p.id !== RESERVED_PRODUCTS_ID)
          .map(p => {
            const user = this.common.users.find(u => u['created'] === +p.desc);
            p.desc = user ? user.surname + ' ' + user.name : '-';
            return p;
          })
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeProduct(product: IProduct) {
    this.modalService.open(ModalComponent, this.modalProperties, (result) => {
      this.http.delete(REST_API.DELETE.productById(product.id))
        .subscribe(r => r === ERestResult[ERestResult.OK] && this.products.splice(this.products.indexOf(product), 1));
    });
  }

  editProduct(product: IProduct) {
    this.modalService.open(BarcodeComponent, { product: Object.assign({}, product) });
  }
}
