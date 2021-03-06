import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { CommonService } from '../../services/common.service';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';
import { BoxesComponent } from './boxes.component';

describe('BoxesComponent', () => {
  let component: BoxesComponent;
  let fixture: ComponentFixture<BoxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoxesComponent, TranslatePipeStub],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: HttpClient, useValue: {
            get: (url: string, params) => of([])
          }
        },
        {
          provide: CommonService, useValue: {
            newBoxtype: new BehaviorSubject(null)
          }
        }
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
