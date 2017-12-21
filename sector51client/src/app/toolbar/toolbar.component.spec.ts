import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ToolbarComponent } from './toolbar.component';
import { Profile } from '../entities/profile';
import { MenuComponent } from '../menu/menu.component';
import { AuthenticationService } from '../services/authentication.service';
import { CommonService } from '../services/common.service';
import { TranslatePipeStub } from '../testing/TranslatePipeStub';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateServiceStub } from '../testing/TranslateServiceStub';
import { ModalService } from '../services/modal.service';

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
      imports: [ RouterTestingModule ],
      providers: [
        { provide: AuthenticationService, useValue: { username: '' } },
        { provide: ModalService, useValue: { } },
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
