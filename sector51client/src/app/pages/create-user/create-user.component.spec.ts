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
import { setInputValue } from '../../testing/commonTest';
import { TranslatePipeStub } from '../../testing/TranslatePipeStub';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  const profileMock = new Profile();
  const form: any = {};
  let locationState;
  let ne;

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

    ne = (css: string) => {
      const res = fixture.debugElement.query(By.css(css));
      return res ? res.nativeElement : undefined;
    };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('validate form', fakeAsync(() => {
    validateField('input[name="login"]', '', 'ng-dirty ng-invalid');
    expect(ne('form').getAttribute('class')).toContain('ng-invalid');
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
    expect(ne('div[hidden]')).toBeUndefined();
    validateField('input[name="password2"]', 'pref.test@qa.team', 'ng-valid');
    expect(ne('div[hidden]')).toBeDefined();
    validateField('input[name="card"]', '', 'ng-invalid');
    validateField('input[name="card"]', 'qqq', 'ng-invalid');
    validateField('input[name="card"]', '0123456789', 'ng-valid');

    expect(ne('form').getAttribute('class')).toContain('ng-valid');
    expect(locationState).toBeUndefined();
    ne('button.btn-primary').click();
    expect(locationState).toEqual('back');
  }));

  it('check button click', fakeAsync(() => {
    fixture.detectChanges();
    expect(locationState).toBeUndefined();
    setInputValue('input[name="login"]', '', fixture);
    ne('button.btn-primary').click();
    expect(locationState).toBeUndefined();

    setInputValue('input[name="login"]', 'login', fixture);
    setInputValue('input[name="name"]', 'name', fixture);
    setInputValue('input[name="surname"]', 'surname', fixture);
    setInputValue('input[name="phone"]', '+380501234567', fixture);
    setInputValue('input[name="email"]', 'q@qa.team', fixture);
    setInputValue('input[name="password"]', 'loginqwe', fixture);
    setInputValue('input[name="password2"]', 'loginqwe', fixture);
    setInputValue('input[name="card"]', '0123456789876', fixture);
    ne('button.btn-primary').click();
    expect(locationState).toBeDefined();
  }));

  function validateField(selector: string, value: string, expectValue: string) {
    setInputValue(selector, value, fixture);
    expect(ne(selector).getAttribute('class')).toContain(expectValue);
  }
});
