import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EConfirmType, ERestResult, ERole, IProduct, IResponse, RESERVED_PRODUCTS_ID } from '../../entities/common';
import { REST_API } from '../../entities/rest-api';
import { CommonService } from '../../services/common.service';

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

  constructor(private http: HttpClient, private common: CommonService) { }

  ngOnInit() {
    this.permissions = this.common.profile.role < ERole.USER;
    this.subscription = this.common.newProduct.subscribe(product => {
      this.http.get<IProduct[]>(REST_API.GET.products).subscribe(products =>
        this.products = products.filter(p => p.id !== 0 && p.id !== RESERVED_PRODUCTS_ID)
          .map(p => {
            const user = this.common.users.find(u => u['created'] === +p.desc);
            p['description'] = user ? user.surname + ' ' + user.name : '-';
            return p;
          })
      );
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeProduct(product: IProduct) {
    this.common.confirm({
      type: EConfirmType.YES_NO,
      headerClass: 'bg-danger',
      icon: 'fa fa-question-circle-o fa-2x text-danger',
      message: 'prompt.RemoveItemQuestion',
      accept: () => this.http.delete(REST_API.DELETE.productById(product.id))
        .subscribe(r => r === ERestResult[ERestResult.OK] && this.products.splice(this.products.indexOf(product), 1))
    });
  }

  updateProduct(product: IProduct) {
    product['done'] = product['success'] = false;
    this.http.put(REST_API.PUT.product, product).subscribe((response: IResponse) => {
      product['done'] = true;
      product['success'] = ERestResult[ERestResult.OK] === response.result;
    });
  }
}
