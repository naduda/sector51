import { Component, Input } from '@angular/core';
import { EConfirmType } from '../../../entities/common';

@Component({
  selector: 'sector51-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent {
  @Input()
  input: any;
  types: any[];

  constructor() {
    this.types = [
      { type: 'USER' },
      { type: 'PRODUCT' }
    ];
  }

  isProductType(): boolean {
    return this.input.type === EConfirmType.PRODUCT;
  }
}
