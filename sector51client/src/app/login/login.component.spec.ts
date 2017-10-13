import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { TranslatePipeStub, Translation } from '../testing/TranslatePipeStub';
import { By } from '@angular/platform-browser';
import { element, browser, by } from 'protractor';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { setInputValue } from '../testing/commonTest';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let ne: any = {};

  const form: any = {};
  const AuthenticationServiceStub = {
    login: (name: string, psw: string): Observable<boolean> => Observable.of(name === psw),
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
    Translation.value = {
      password: 'password',
      login: {
        title: 'authentification',
        login: 'login',
        button: 'login',
        error: {
          incorrectLogin: 'Login or password is incorrect.'
        }
      }
    };
    ne = (css: string) => {
      const res = fixture.debugElement.query(By.css(css));
      return res ? res.nativeElement : undefined;
    };

    form.title = ne('h2.text-center');
    form.lbLogin = ne('label[for="username"]');
    form.tbLogin = 'input[name="username"]';
    form.lbPassword = ne('label[for="password"]');
    form.tbPassword = 'input[name="password"]';
    form.button = ne('button');
  });

  it('validate form', fakeAsync(() => {
    expect(component).toBeTruthy();
    setInputValue(form.tbLogin, '', fixture);
    setInputValue(form.tbPassword, '', fixture);
    form.button.click();
    fixture.detectChanges();
    expect(ne('span.help-block.un')).toBeDefined();
    expect(ne('span.help-block.psw')).toBeDefined();
    expect(ne('div.alert.alert-danger')).toBeFalsy();

    setInputValue(form.tbLogin, 'name', fixture);
    form.button.click();
    fixture.detectChanges();
    expect(ne('span.help-block.un')).toBeFalsy();
    expect(ne('span.help-block.psw')).toBeDefined();
    expect(ne('div.alert.alert-danger')).toBeFalsy();

    setInputValue(form.tbPassword, 'password', fixture);
    form.button.click();
    fixture.detectChanges();
    expect(ne('span.help-block.un')).toBeFalsy();
    expect(ne('span.help-block.psw')).toBeFalsy();
    expect(ne('div.alert.alert-danger')).toBeDefined();

    setInputValue(form.tbPassword, 'name', fixture);
    form.button.click();
    fixture.detectChanges();
    expect(ne('span.help-block.un')).toBeFalsy();
    expect(ne('span.help-block.psw')).toBeFalsy();
    expect(ne('div.alert.alert-danger')).toBeFalsy();

    expect(ne('button > i.fa.fa-spinner')).toBeDefined();
    AuthenticationServiceStub.logout();
    fixture.detectChanges();
    expect(ne('button > i.fa.fa-spinner')).toBeFalsy();
  }));
});
