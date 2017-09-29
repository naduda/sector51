import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { By } from '@angular/platform-browser';
import { element } from 'protractor';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export const ButtonClickEvents = {
  left:  { button: 0 },
  right: { button: 2 }
};

export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

describe('LoginComponent', () => {
  const LangServiceStub = { authentication: 'authentication' };
  const AuthenticationServiceStub = {
    login: (name: string, psw: string): Observable<boolean> => Observable.of(name === psw),
    logout: () => {},
    navigate: () => {}
  };
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

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
  });

  it('validate form', fakeAsync(() => {
    const ne = (css: string) => fixture.debugElement.query(By.css(css)).nativeElement;
    expect(component).toBeTruthy();
    const username  = ne('input[name="username"]');
    const password  = ne('input[name="password"]');
    const button = ne('button');
    const form = ne('form');
    setInputValue('input[name="username"]', '');
    click(button);
    fixture.detectChanges();
  }));

  function setInputValue(selector: string, value: string) {
    fixture.detectChanges();
    tick();
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    tick();
  }
});
