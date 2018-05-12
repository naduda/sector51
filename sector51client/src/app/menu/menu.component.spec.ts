import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '../entities/profile';
import { CreateUserComponent } from '../pages/create-user/create-user.component';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { MenuComponent } from './menu.component';

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
      providers: [],
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
