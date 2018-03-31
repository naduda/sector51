import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'sector51-modal',
  templateUrl: './modal.component.html',
  styles: [`
    div.modal-header {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
  `]
})
export class ModalComponent implements OnInit {
  @Input() header;
  @Input() headerParam;
  @Input() btOK;
  @Input() btCancel;
  @Input() headerClass;
  @Input() bodyClass;
  @Input() body;
  private ready: boolean;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.ready = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.ready || event.keyCode !== 13) return;
    if (event.keyCode === 13) this.activeModal.close(true);
  }
}
