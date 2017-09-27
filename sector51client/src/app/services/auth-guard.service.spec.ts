import { TestBed, inject } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';

import { CanActivateAuthGuard } from './auth-guard.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { CommonService } from 'app/services/common.service';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        CanActivateAuthGuard,
        { provide: AuthenticationService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        CommonService
      ]
    });
  });

  it('should be created', inject([CanActivateAuthGuard], (service: CanActivateAuthGuard) => {
    expect(service).toBeTruthy();
  }));
});
