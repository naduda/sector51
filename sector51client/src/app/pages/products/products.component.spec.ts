import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { ERole, RESERVED_PRODUCTS_ID } from '../../entities/common';
import { CommonService } from '../../services/common.service';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';
import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsComponent, TranslatePipeStub],
      providers: [
        {
          provide: HttpClient, useValue: {
            get: (idUser: string) => of([
              { id: 0, name: 'NEW', desc: '-' }, { id: RESERVED_PRODUCTS_ID, name: 'USER', desc: 'user', price: 0 }
            ]),
          }
        },
        {
          provide: CommonService, useValue: {
            profile: { role: ERole.ADMIN },
            newProduct: new BehaviorSubject(null)
          }
        }
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
