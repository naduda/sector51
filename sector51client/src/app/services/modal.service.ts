import { Injectable } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { IModalWindow, IModalProperties } from '../entities/common';

@Injectable()
export class ModalService {
  private current: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  open(component: IModalWindow | any, props: IModalProperties, btOkClick?: any, btCancelClick?: any) {
    if (this.current != null) {
      this.current.close();
    }
    this.current = this.modalService.open(component, { backdrop  : 'static' });
    if (props != null) {
      Object.keys(props).forEach((key) => this.current.componentInstance[key] = props[key]);
    }
    const instance = this.current.componentInstance;
    this.current.result.then((result) => {
      if (result === true) {
        const onOK = instance.btOkClick || btOkClick;
        onOK && onOK(props);
      }
    }, (reason) => {
      const onCancel = instance.btCancelClick || btCancelClick;
      if (onCancel) {
        onCancel(reason);
      }
    });
  }
}
