import { TestBed, inject } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('ModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ModalService,
        { provide: NgbModal, useValue: {} }
      ]
    });
  });

  it('should be created', inject([ModalService], (service: ModalService) => {
    expect(service).toBeTruthy();
  }));
});
