import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MenuComponent } from './menu.component';
import { CreateUserComponent } from '../pages/create-user/create-user.component';
import { Profile } from '../entities/profile';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MenuComponent,
        CreateUserComponent,
        TranslatePipeStub
      ],
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'registration', component: CreateUserComponent },
        ]),
        NgbModule.forRoot()
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
