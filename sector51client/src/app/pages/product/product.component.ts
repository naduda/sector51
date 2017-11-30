import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/common.service';
import { IProduct, IBarcode, IModalWindow, IModalProperties } from '../../entities/common';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'sector51-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  public ready: boolean;
  public header: string;
  public headerClass: string;
  public btOk: string;
  public products: IProduct[];
  public product: IProduct;

  constructor(public activeModal: NgbActiveModal, private http: HttpClient,
              public common: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.http.get<IProduct[]>('/api/products')
      .do(products => {
        this.products = products;
        this.product = products[0];
      })
      .flatMap(products => this.http.get<IBarcode>('/api/barcode/' + this.common.barcode))
      .subscribe(data => {
        this.headerClass = 'bg-info';
        this.btOk = 'apply';
        this.ready = true;
      }, error => {
        this.header = 'unknownBarcode';
        this.headerClass = 'bg-warning';
        this.btOk = 'add';
        this.ready = true;
      });
  }

  btOkClick(props: any): any {
    props.instance.router.navigate(['/registration'], { queryParams: { code: props.code } });
  }

  btCancelClick(reason: any) {
    console.log(reason);
  }
}
