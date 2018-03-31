import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxtypeComponent } from './boxtype.component';
import { FocusDirective } from '../../../directives/focus.directive';
import { TranslatePipeStub } from '../../../testing/TranslatePipeStub';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { CommonService } from '../../../services/common.service';

describe('BoxtypeComponent', () => {
  let component: BoxtypeComponent;
  let fixture: ComponentFixture<BoxtypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxtypeComponent, TranslatePipeStub, FocusDirective ],
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
    fixture = TestBed.createComponent(BoxtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
