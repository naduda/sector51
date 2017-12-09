import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { CommonService } from './services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceStub } from './testing/TranslateServiceStub';

export class CommonServiceStub {
  static isLoginValue = true;
  get isLogin() {
    return CommonServiceStub.isLoginValue;
  }
  fromStorage = (key: string) => undefined;
}
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: any;
  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: CommonService, useClass: CommonServiceStub },
        { provide: TranslateService, useClass: TranslateServiceStub }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    app = fixture.debugElement.componentInstance;
  });

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it('should have 2 div in row', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.row > div').length).toEqual(1);
    CommonServiceStub.isLoginValue = false;
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.row > div').length).toEqual(2);
  }));
});
