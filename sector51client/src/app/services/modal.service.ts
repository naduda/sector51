import { Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../pages/modal/modal.component';

export interface IModalProperties {
  header: string;
  headerClass?: string;
  body: string;
  bodyClass?: string;
  btOK: string;
  btCancel?: string;
}

@Injectable()
export class ModalService {

  constructor(private modalService: NgbModal) { }

  open(props: IModalProperties, callbackOK: any, callbackDismiss?: any) {
    const modalRef = this.modalService.open(ModalComponent, {backdrop  : 'static'});
    Object.keys(props).forEach((key) => modalRef.componentInstance[key] = props[key]);
    modalRef.result.then((result) => {
      if (result === true) {
        callbackOK(result);
      }
    }, (reason) => callbackDismiss && callbackDismiss(reason));
  }
}
