import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sector51-modal',
  templateUrl: './modal.component.html',
  styles: [`
    div.modal-header {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
    button.btn:hover { cursor: pointer; }
  `]
})
export class ModalComponent {
  @Input() header;
  @Input() body;
  @Input() btOK;
  @Input() btCancel;
  @Input() headerClass;
  @Input() bodyClass;

  constructor(public activeModal: NgbActiveModal) {}
}
