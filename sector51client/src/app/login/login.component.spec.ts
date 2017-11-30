import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { By } from '@angular/platform-browser';
import { element, browser, by } from 'protractor';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ElementTools } from '../testing/commonTest';
import { of } from 'rxjs/observable/of';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let et: ElementTools<LoginComponent>;

  const form: any = {};
  const AuthenticationServiceStub = {
    login: (name: string, psw: string): Observable<boolean> => of(name === psw),
    logout: () => component.loading = false,
    navigate: () => component.error = undefined
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent, TranslatePipeStub ],
      imports: [ FormsModule ],
      providers: [
        { provide: AuthenticationService, useValue: AuthenticationServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    et = new ElementTools(fixture);

    form.title = et.ne('h2.text-center');
    form.lbLogin = et.ne('label[for="username"]');
    form.tbLogin = 'input[name="username"]';
    form.lbPassword = et.ne('label[for="password"]');
    form.tbPassword = 'input[name="password"]';
    form.button = et.ne('button');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('validate form', fakeAsync(() => {
    et.setInputValue(form.tbLogin, '');
    et.setInputValue(form.tbPassword, '');
    form.button.click();
    fixture.detectChanges();
    expect(et.ne('span.help-block.un')).toBeDefined();
    expect(et.ne('span.help-block.psw')).toBeDefined();
    expect(et.ne('div.alert.alert-danger')).toBeFalsy();

    et.setInputValue(form.tbLogin, 'name');
    form.button.click();
    fixture.detectChanges();
    expect(et.ne('span.help-block.un')).toBeFalsy();
    expect(et.ne('span.help-block.psw')).toBeDefined();
    expect(et.ne('div.alert.alert-danger')).toBeFalsy();

    et.setInputValue(form.tbPassword, 'password');
    form.button.click();
    fixture.detectChanges();
    expect(et.ne('span.help-block.un')).toBeFalsy();
    expect(et.ne('span.help-block.psw')).toBeFalsy();
    expect(et.ne('div.alert.alert-danger')).toBeDefined();

    et.setInputValue(form.tbPassword, 'name');
    form.button.click();
    fixture.detectChanges();
    expect(et.ne('span.help-block.un')).toBeFalsy();
    expect(et.ne('span.help-block.psw')).toBeFalsy();
    expect(et.ne('div.alert.alert-danger')).toBeFalsy();

    expect(et.ne('button > i.fa.fa-spinner')).toBeDefined();
    AuthenticationServiceStub.logout();
    fixture.detectChanges();
    expect(et.ne('button > i.fa.fa-spinner')).toBeFalsy();
  }));
});
