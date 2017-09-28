import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'prNgCommon/lang/lang.service';

import { MenuComponent } from './menu.component';
import { CreateUserComponent } from '../pages/create-user/create-user.component';
import { PermissionsComponent } from '../pages/permissions/permissions.component';
import { Profile } from '../entities/profile';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { TranslateServiceStub } from '../testing/TranslateServiceStub';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuComponent,
        CreateUserComponent,
        PermissionsComponent,
        TranslatePipeStub
      ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'registration', component: CreateUserComponent },
          { path: 'permissions', component: PermissionsComponent }
        ]),
        NgbModule.forRoot()
      ],
      providers: [
        { provide: LangService, useValue: {} },
        { provide: TranslateService, useClass: TranslateServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    component.currentUser = new Profile();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
