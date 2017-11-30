import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { WebsocketService } from './websocket.service';
import { ModalService } from './modal.service';
import { CommonService } from './common.service';

describe('WebsocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        { provide: ModalService, useValue: {} },
        { provide: CommonService, useValue: {} },
        WebsocketService
      ]
    });
  });

  it('should be created', inject([WebsocketService], (service: WebsocketService) => {
    expect(service).toBeTruthy();
  }));
});
