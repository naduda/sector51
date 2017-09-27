import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LangService } from 'prNgCommon/lang/lang.service';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from 'prNgCommon/common.module';
import { Profile } from 'app/entities/profile';
import { MenuComponent } from 'app/menu/menu.component';
import { AuthenticationService } from 'app/services/authentication.service';
import { CommonService } from 'app/services/common.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolbarComponent,
        MenuComponent
      ],
      imports: [
        CommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: LangService, useValue: {} },
        { provide: AuthenticationService, useValue: { username: '' } },
        { provide: CommonService, useValue: { user: new BehaviorSubject(null), profile: new Profile() } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
