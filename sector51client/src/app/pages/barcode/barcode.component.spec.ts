import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';
import { CommonService } from '../../services/common.service';
import { BarcodeComponent } from './barcode.component';
import { of } from 'rxjs/observable/of';
import { FormsModule } from '@angular/forms';
import { RESERVED_PRODUCTS_ID } from '../../entities/common';
import { REST_API } from '../../entities/rest-api';

describe('BarcodeComponent', () => {
  let component: BarcodeComponent;
  let fixture: ComponentFixture<BarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeComponent, TranslatePipeStub ],
      imports: [ FormsModule ],
      providers: [
        NgbActiveModal,
        { provide: HttpClient, useValue: {
          get: (key: string) => {
            if (key === REST_API.GET.products)
              return of([ { id: 0, name: 'NEW', desc: '-' }, { id: RESERVED_PRODUCTS_ID, name: 'USER', desc: 'user', price: 0 } ]);
            else
              return of({ productId: -1 });
          },
        }},
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
