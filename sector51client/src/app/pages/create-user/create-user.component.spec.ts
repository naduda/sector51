import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Location, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

import { CreateUserComponent } from './create-user.component';
import { ActivatedRoute } from '@angular/router';
import { Profile } from '../../entities/profile';
import { Observable } from 'rxjs/Observable';
import { ERole } from '../../entities/common';
import { By } from '@angular/platform-browser';
import { ElementTools } from '../../testing/commonTest';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  const profileMock = new Profile();
  const form: any = {};
  let locationState;
  let et: ElementTools<CreateUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserComponent, TranslatePipeStub ],
      imports: [
        FormsModule,
        NgbModule.forRoot(),
      ],
      providers: [
        { provide: Location, useValue: { back: () => locationState = 'back'} },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: CommonService, useValue: { profile: profileMock } },
        { provide: ActivatedRoute, useValue: { params: Observable.of({ idUser: undefined }) } },
        { provide: HttpClient, useValue: {
            get: (idUser: string) => Observable.of(undefined),
            post: (url: string, body: any | null, options?: any) => Observable.of({name: 'qqqq'}),
            put: (q: string, body: any) => Observable.of({})
          }
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    profileMock['iroles'] = [
      { id: ERole.OWNER, name: ERole[ERole.OWNER] },
      { id: ERole.ADMIN, name: ERole[ERole.ADMIN] },
      { id: ERole.USER, name: ERole[ERole.USER] }
    ];
    profileMock['permited'] = true;
    locationState = undefined;

    et = new ElementTools(fixture);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('validate form', fakeAsync(() => {
    validateField('input[name="login"]', '', 'ng-dirty ng-invalid');
    expect(et.ne('form').getAttribute('class')).toContain('ng-invalid');
    validateField('input[name="login"]', 'Login12ю', 'ng-invalid');
    validateField('input[name="login"]', 'Login12', 'ng-valid');
    validateField('input[name="name"]', 'TestТест ', 'ng-invalid');
    validateField('input[name="name"]', 'TestТест', 'ng-valid');
    validateField('input[name="surname"]', 'TestТестsuname ', 'ng-invalid');
    validateField('input[name="surname"]', 'TestТестsuname', 'ng-valid');
    validateField('input[name="phone"]', '+380501111111', 'ng-valid');
    validateField('input[name="phone"]', '+38(050)1111111', 'ng-valid');
    validateField('input[name="phone"]', '+38(0501111111', 'ng-valid');
    validateField('input[name="phone"]', '+38050 111 11 11', 'ng-valid');
    validateField('input[name="phone"]', '+38050 111-11-11', 'ng-valid');
    validateField('input[name="phone"]', '+38(050) 111-11-11', 'ng-valid');
    validateField('input[name="email"]', 'pref.test@qa', 'ng-invalid');
    validateField('input[name="email"]', 'pref.test@qa.team', 'ng-valid');
    validateField('input[name="password"]', '', 'ng-invalid');
    validateField('input[name="password"]', 'pref.test@qa.team', 'ng-valid');
    validateField('input[name="password2"]', '', 'ng-invalid');
    validateField('input[name="password2"]', 'qwe', 'ng-valid');
    expect(et.ne('div[hidden]')).toBeUndefined();
    validateField('input[name="password2"]', 'pref.test@qa.team', 'ng-valid');
    expect(et.ne('div[hidden]')).toBeDefined();
    validateField('input[name="card"]', '', 'ng-invalid');
    validateField('input[name="card"]', 'qqq', 'ng-invalid');
    validateField('input[name="card"]', '0123456789', 'ng-valid');

    expect(et.ne('form').getAttribute('class')).toContain('ng-valid');
    expect(locationState).toBeUndefined();
    et.ne('button.btn-primary').click();
    expect(locationState).toEqual('back');
  }));

  it('check button click', fakeAsync(() => {
    fixture.detectChanges();
    expect(locationState).toBeUndefined();
    et.setInputValue('input[name="login"]', '');
    et.ne('button.btn-primary').click();
    expect(locationState).toBeUndefined();

    et.setInputValue('input[name="login"]', 'login');
    et.setInputValue('input[name="name"]', 'name');
    et.setInputValue('input[name="surname"]', 'surname');
    et.setInputValue('input[name="phone"]', '+380501234567');
    et.setInputValue('input[name="email"]', 'q@qa.team');
    et.setInputValue('input[name="password"]', 'loginqwe');
    et.setInputValue('input[name="password2"]', 'loginqwe');
    et.setInputValue('input[name="card"]', '0123456789876');
    et.ne('button.btn-primary').click();
    expect(locationState).toBeDefined();
  }));

  it('check dropdown lists (Authorities and Gender)', fakeAsync(() => {
    fixture.detectChanges();
    const divSelector = 'div.form-group.row:nth-child(9)';
    checkDropDown(divSelector, ' > div:first-child > div > i', 'OWNER');
    checkDropDown(divSelector, ' > div:first-child > div > i', 'ADMIN');
    checkDropDown(divSelector, ' > div:last-child > div > i', 'MAN');
    checkDropDown(divSelector, ' > div:last-child > div > i', 'WOMAN');
  }));

  function checkDropDown(selector: string, iSelector: string, inputValue: string) {
    et.click(selector + iSelector);
    et.click(selector + ' input[value="' + inputValue + '"]');
    expect(et.ne(selector + iSelector).innerHTML).toEqual(inputValue);
  }

  function validateField(selector: string, value: string, expectValue: string) {
    et.setInputValue(selector, value);
    expect(et.ne(selector).getAttribute('class')).toContain(expectValue);
  }
});
