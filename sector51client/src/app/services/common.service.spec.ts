import { TestBed, inject } from '@angular/core/testing';

import { CommonService } from './common.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [CommonService]
    });
  });

  it('should be created', inject([CommonService], (service: CommonService) => {
    expect(service).toBeTruthy();
  }));
});
