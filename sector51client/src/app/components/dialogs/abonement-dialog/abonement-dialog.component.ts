import { Component, Input } from '@angular/core';
import { EConfirmType } from '../../../entities/common';

@Component({
  selector: 'sector51-abonement-dialog',
  templateUrl: './abonement-dialog.component.html',
  styleUrls: ['./abonement-dialog.component.css']
})
export class AbonementDialogComponent {
  @Input()
  input: any;

  constructor() { }

  isAbonType(): boolean {
    return this.input.type === EConfirmType.ABON;
  }

  isBoxType(): boolean {
    return this.input.type === EConfirmType.BOX;
  }

  isTrainerType(): boolean {
    return this.input.type === EConfirmType.TRAINER;
  }
}
