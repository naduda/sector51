import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, async, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AngularSplitModule } from 'angular-split';
import { of } from 'rxjs/observable/of';
import { ERole } from '../entities/common';
import { Profile } from '../entities/profile';
import { CommonService } from '../services/common.service';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { ElementTools, USERS_MOCK } from '../testing/commonTest';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let et: ElementTools<MainComponent>;
  let currentProfile = 0;
  let users: Profile[];

  class CommonServiceStub {
    get profile() {
      return users[currentProfile];
    }
    fromStorage = (key: string) => undefined;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent, TranslatePipeStub],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'main', component: MainComponent },
          { path: 'registration/:idUser', component: MainComponent }
        ]),
        NgbModule.forRoot(),
        AngularSplitModule
      ],
      providers: [
        {
          provide: HttpClient, useValue: {
            get: (url: string) => {
              if (url.endsWith('/api/users')) return of(USERS_MOCK);
              return of([]);
            }
          }
        },
        { provide: TranslateService, useValue: { get: (key) => of(key) } },
        { provide: CommonService, useClass: CommonServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    users = [];
    USERS_MOCK.forEach(u => users.push(Object.assign({}, u)));
    component.common.users = users;
    component.common.users[1]['active'] = true;
    et = new ElementTools(fixture);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('check showAll functionality', fakeAsync(() => {
    fixture.detectChanges();
    const selector = 'split-area ul > li';
    const users = et.all(selector);
    expect(users.length).toBe(7, 'all users should be 7');
    expect(et.all(selector + '[hidden]').length).toBe(6, 'not active users should be 6');
    component.common.users[5]['active'] = true;
    fixture.detectChanges();
    expect(et.all(selector + '[hidden]').length).toBe(4, 'not active users should be 4');
    et.click('div.mt-3 > label > input[type="checkbox"]');
    expect(et.all(selector + '[hidden]').length).toBe(0, 'not active users should be 0');
  }));

  it('check card functionality', fakeAsync(() => {
    currentProfile = users.findIndex(u => u.role === ERole.OWNER);
    fixture.detectChanges();
    const card = et.de('split-area div.card');
    expect(card).toBeDefined('card of logined user');
    et.click('split-area ul > li:nth-child(2)');
    expect(card).toBeDefined('card should be visible');
    const buttons = et.de('div.card div.bg-light');
    expect(buttons).toBeDefined('buttons should be visible for OWNER');
  }));

  it('check permissions for USER', fakeAsync(() => {
    currentProfile = users.findIndex(u => u.role === ERole.USER);
    fixture.detectChanges();
    const card = et.de('split-area div.card');
    et.click('split-area ul > li:first-child');
    expect(card).toBeDefined('card should be visible');
    const buttons = et.de('div.bg-light');
    expect(buttons).toBe(null, 'buttons should not be visible for USER');
  }));

  it('check permissions for USER', fakeAsync(() => {
    currentProfile = users.findIndex(u => u.role === ERole.ADMIN);
    fixture.detectChanges();
    et.click('split-area ul > li:first-child');
    const buttons = et.de('div.bg-light');
    expect(buttons).toBeDefined('buttons should be visible for OWNER');
    et.click('button.btn-danger');
  }));
});
