import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalService } from 'app/services/modal.service';
import { CommonService } from 'app/services/common.service';
import { LangService } from 'prNgCommon/lang/lang.service';

import { MainComponent } from './main.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'main', component: MainComponent }
        ]),
        HttpClientModule,
        NgbModule.forRoot()
      ],
      providers: [
        ModalService,
        CommonService,
        { provide: LangService, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    component.users = [];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
