import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesComponent } from './boxes.component';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../services/modal.service';
import { IModalProperties } from '../../entities/common';
import { CommonService } from '../../services/common.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('BoxesComponent', () => {
  let component: BoxesComponent;
  let fixture: ComponentFixture<BoxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxesComponent, TranslatePipeStub ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([ ]),
        NgbModule.forRoot()
      ],
      providers: [
        NgbActiveModal,
        { provide: HttpClient, useValue: {
          get: (url: string, params) => of([])
        }},
        { provide: ModalService, useValue: {
          open: (props: IModalProperties, callbackOK: any, callbackDismiss?: any) => {}
        }},
        { provide: CommonService, useValue: {
          newBoxtype: new BehaviorSubject(null)
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
