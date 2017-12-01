import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';
import { CommonService } from '../../services/common.service';
import { BarcodeComponent } from './barcode.component';
import { of } from 'rxjs/observable/of';

describe('ProductComponent', () => {
  let component: BarcodeComponent;
  let fixture: ComponentFixture<BarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeComponent, TranslatePipeStub ],
      providers: [
        NgbActiveModal,
        { provide: HttpClient, useValue: {
          get: (idUser: string) => of([{ id: 0, name: 'USER', desc: 'user' }]),
        } },
        { provide: Router, useValue: { } },
        { provide: CommonService, useValue: { } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
