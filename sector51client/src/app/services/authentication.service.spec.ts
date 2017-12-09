import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { WebsocketService } from '../services/websocket.service';
import { CommonService } from './common.service';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        AuthenticationService,
        { provide: WebsocketService, useValue: {} },
        { provide: CommonService, useValue: {} }
      ]
    });
  });

  it('should be created', inject([AuthenticationService],
    (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
