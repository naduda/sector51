import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent, TranslatePipeStub ],
      providers: [
        NgbActiveModal
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    component.header = 'header';
    component.body = 'Body message';
    component.btOK = 'OK';
    component.btCancel = 'Cancel';
    component.headerClass = '';
    component.bodyClass = '';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
