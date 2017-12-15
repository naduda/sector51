import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';
import { ModalService } from '../../services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { RESERVED_PRODUCTS_ID, ERole } from '../../entities/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsComponent, TranslatePipeStub ],
      providers: [
        { provide: HttpClient, useValue: {
          get: (idUser: string) => of([
            { id: 0, name: 'NEW', desc: '-' }, { id: RESERVED_PRODUCTS_ID, name: 'USER', desc: 'user', price: 0 }
          ]),
        }},
        { provide: CommonService, useValue: {
          profile: { role: ERole.ADMIN },
          newProduct: new BehaviorSubject(null)
        }},
        { provide: ModalService, useValue: { open: () => {} } },
        { provide: TranslateService, useValue: { get: (key) => of(key + '!') } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
