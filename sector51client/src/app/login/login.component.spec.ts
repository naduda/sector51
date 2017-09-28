import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { LoginComponent } from './login.component';
import { LangService } from 'prNgCommon/lang/lang.service';
import { AuthenticationService } from '../services/authentication.service';
import { TranslateServiceStub } from '../testing/TranslateServiceStub';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';

describe('LoginComponent', () => {
  const LangServiceStub = {
    authentication: 'authentication'
  };
  const AuthenticationServiceStub = {
    logout: () => {}
  };
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent, TranslatePipeStub ],
      imports: [ FormsModule ],
      providers: [
        { provide: LangService, useValue: LangServiceStub },
        { provide: AuthenticationService, useValue: AuthenticationServiceStub },
        { provide: TranslateService, useClass: TranslateServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('validate form', () => {
    expect(component).toBeTruthy();
  });

  // private validationForm() {
  //   return this.clearElement(this.username)
  //     .then(() => this.clearElement(this.password))
  //     .then(this.button.click)
  //     .then(() => expect(element(by.className('help-block un')).isPresent()).toBeTruthy())
  //     .then(() => expect(element(by.className('help-block psw')).isPresent()).toBeTruthy())
  //     .then(() => this.username.sendKeys('name'))
  //     .then(() => expect(element(by.className('help-block un')).isPresent()).toBeFalsy())
  //     .then(() => expect(element(by.className('help-block psw')).isPresent()).toBeTruthy())
  //     .then(() => this.password.sendKeys('password'))
  //     .then(() => expect(element(by.className('help-block un')).isPresent()).toBeFalsy())
  //     .then(() => expect(element(by.className('help-block psw')).isPresent()).toBeFalsy())
  //     .then(this.button.click)
  //     .then(() => expect(element(by.className('alert alert-danger')).isPresent()).toBeTruthy())
  //     .then(() => this.clearElement(this.username))
  //     .then(() => expect(element(by.className('help-block un')).isPresent()).toBeTruthy())
  //     .then(() => expect(element(by.className('help-block psw')).isPresent()).toBeFalsy())
  //     .then(this.username.clear)
  //     .then(this.password.clear)
  //     .then(() => this.printText('Check valid messages'));
  // }
});
