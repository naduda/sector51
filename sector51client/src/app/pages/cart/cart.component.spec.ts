import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { CommonService } from '../../services/common.service';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartComponent, TranslatePipeStub ],
      imports: [ FormsModule ],
      providers: [
        { provide: CommonService, useValue: { cartProducts: [] } },
        { provide: HttpClient, useValue: { } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
