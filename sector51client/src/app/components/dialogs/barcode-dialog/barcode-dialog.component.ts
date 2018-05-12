import { Component, Input } from '@angular/core';
import { EConfirmType } from '../../../entities/common';

@Component({
  selector: 'sector51-barcode-dialog',
  templateUrl: './barcode-dialog.component.html',
  styleUrls: ['./barcode-dialog.component.css']
})
export class BarcodeDialogComponent {
  @Input()
  input: any;
  types: any[];

  constructor() {
    this.types = [
      { type: 'USER' },
      { type: 'PRODUCT' }
    ];
  }

  isBarcodeType(): boolean {
    return this.input.type === EConfirmType.BARCODE;
  }
}
