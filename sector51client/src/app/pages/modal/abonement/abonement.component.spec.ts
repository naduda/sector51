import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonementComponent } from './abonement.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../../services/common.service';
import { of } from 'rxjs/observable/of';
import { FormsModule } from '@angular/forms';
import { TranslatePipeStub } from '../../../testing/TranslatePipeStub';

describe('AbonementComponent', () => {
  let component: AbonementComponent;
  let fixture: ComponentFixture<AbonementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbonementComponent, TranslatePipeStub ],
      imports: [ FormsModule ],
      providers: [
        NgbActiveModal,
        { provide: HttpClient, useValue: {
          get: (url: string, params) => of([])
        }},
        { provide: CommonService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
