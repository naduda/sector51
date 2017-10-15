import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalService, IModalProperties } from '../services/modal.service';
import { CommonService } from '../services/common.service';

import { MainComponent } from './main.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { Profile } from '../entities/profile';
import { ERole } from '../entities/common';
import { USERS_MOCK, ElementTools } from '../testing/commonTest';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let et: ElementTools<MainComponent>;
  let currentProfile = 0;
  let location: string;

  class CommonServiceStub {
    get profile() {
      return USERS_MOCK[currentProfile];
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent, TranslatePipeStub ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'main', component: MainComponent },
          { path: 'registration/:idUser', component: MainComponent }
        ]),
        NgbModule.forRoot()
      ],
      providers: [
        { provide: ModalService, useValue: {
          open: (props: IModalProperties, callbackOK: any, callbackDismiss?: any) => {
            location = 'modal';
          }}
        },
        { provide: HttpClient, useValue: {} },
        { provide: TranslateService, useValue: { get: (key) => Observable.of(key) } },
        { provide: CommonService, useClass: CommonServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    component.users = USERS_MOCK;
    component.users[1]['active'] = true;
    et = new ElementTools(fixture);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('check showAll functionality', fakeAsync(() => {
    fixture.detectChanges();
    const selector = 'div.users > ul > li';
    const users = et.all(selector);
    expect(users.length).toBe(7, 'all users should be 7');
    expect(et.all(selector + '[hidden]').length).toBe(6, 'not active users should be 6');
    component.users[5]['active'] = true;
    fixture.detectChanges();
    expect(et.all(selector + '[hidden]').length).toBe(5, 'not active users should be 5');
    et.click('div.mt-3 > label > input[type="checkbox"]');
    expect(et.all(selector + '[hidden]').length).toBe(0, 'not active users should be 0');
  }));

  it('check card functionality', fakeAsync(() => {
    currentProfile = USERS_MOCK.findIndex(u => u.role === ERole.OWNER);
    fixture.detectChanges();
    const card = et.de('div.user-flex > div.card');
    expect(card).toBe(null, 'card is empty while user isn\'t selected');
    et.click('div.users > ul > li:first-child');
    expect(card).toBeDefined('card should be visible');
    const buttons = et.de('div.bg-faded');
    expect(buttons).toBeDefined('buttons should be visible for OWNER');
  }));

  it('check permissions for USER', fakeAsync(() => {
    currentProfile = USERS_MOCK.findIndex(u => u.role === ERole.USER);
    fixture.detectChanges();
    const card = et.de('div.user-flex > div.card');
    et.click('div.users > ul > li:first-child');
    expect(card).toBeDefined('card should be visible');
    const buttons = et.de('div.bg-faded');
    expect(buttons).toBe(null, 'buttons should not be visible for USER');
  }));

  it('check permissions for USER', fakeAsync(() => {
    currentProfile = USERS_MOCK.findIndex(u => u.role === ERole.ADMIN);
    fixture.detectChanges();
    et.click('div.users > ul > li:first-child');
    const buttons = et.de('div.bg-faded');
    expect(buttons).toBeDefined('buttons should be visible for OWNER');
    expect(location).toBeUndefined();
    et.click('button.btn-danger');
    expect(location).toEqual('modal');
  }));
});
