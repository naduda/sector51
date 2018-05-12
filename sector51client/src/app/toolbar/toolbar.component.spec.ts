import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Profile } from '../entities/profile';
import { MenuComponent } from '../menu/menu.component';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from '../services/common.service';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { TranslateServiceStub } from '../testing/TranslateServiceStub';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolbarComponent,
        MenuComponent,
        TranslatePipeStub
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: { username: '' } },
        { provide: CommonService, useValue: { user: new BehaviorSubject(null), profile: new Profile() } }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    component.locales = TranslateServiceStub.stabLocales;
    component.currentLang = component.locales[0].name;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
