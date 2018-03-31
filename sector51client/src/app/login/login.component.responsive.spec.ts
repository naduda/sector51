import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { By } from '@angular/platform-browser';
import { element, browser, by } from 'protractor';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';

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
        { provide: AuthenticationService, useValue: AuthenticationServiceStub },
        { provide: HttpClient, useValue: {
          get: (url, params): Observable<boolean> => of(false)
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('responsive design', () => {
    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.css('form[name="loginForm"]'));
    expect(debugElement).toBeDefined();
    const nativeElement = debugElement.nativeElement;
    expect(nativeElement.offsetWidth).toBeGreaterThan(250);
    expect(nativeElement.offsetWidth).toBeLessThan(365);
  });
});
