import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'prNgCommon/lang/lang.service';

import { CommonModule } from 'prNgCommon/common.module';

import { ToolbarComponent } from './toolbar.component';
import { Profile } from '../entities/profile';
import { MenuComponent } from '../menu/menu.component';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from '../services/common.service';
import { TranslateServiceStub } from '../testing/TranslateServiceStub';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolbarComponent,
        MenuComponent,
        TranslatePipeStub
      ],
      imports: [
        CommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: LangService, useValue: {} },
        { provide: AuthenticationService, useValue: { username: '' } },
        { provide: CommonService, useValue: { user: new BehaviorSubject(null), profile: new Profile() } },
        { provide: TranslateService, useClass: TranslateServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    component.locales = TranslateServiceStub.stabLocales;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
