import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { TranslatePipeStub, Translation } from '../testing/TranslatePipeStub';
import { By } from '@angular/platform-browser';
import { element, browser, by } from 'protractor';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const AuthenticationServiceStub = {
    logout: () => component.loading = false,
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
  });

  it('responsive design', () => {
    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.css('form[name="loginForm"]'));
    expect(debugElement).toBeDefined();
    const element = debugElement.nativeElement;
    expect(element.offsetWidth).toBeGreaterThan(250);
    expect(element.offsetWidth).toBeLessThan(365);
  });
});
