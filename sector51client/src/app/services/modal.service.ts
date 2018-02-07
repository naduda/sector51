import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { IModalWindow, IModalProperties } from '../entities/common';

@Injectable()
export class ModalService {
  private current: NgbModalRef;
  public properties: any;

  constructor(private modal: NgbModal) {}

  open(component: IModalWindow | any, props: IModalProperties | any, btOkClick?: any, btCancelClick?: any) {
    this.current && this.current.close();
    this.properties = props;

    this.current = this.modal.open(component, { backdrop  : 'static' });
    if (props != null) {
      Object.keys(props).forEach((key) => this.current.componentInstance[key] = props[key]);
    }
    const instance = this.current.componentInstance;
    instance.init && instance.init(props);
    this.current.result.then((result) => {
      instance.ready = undefined;
      if (result === true) {
        const onOK = instance.btOkClick || btOkClick;
        onOK && onOK(instance, btOkClick);
      }
    }, (reason) => {
      const onCancel = instance.btCancelClick || btCancelClick;
      instance.ready = undefined;
      onCancel && onCancel(reason, instance);
    });
  }
}
