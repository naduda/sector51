import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'app/services/common.service';

import { CreateUserComponent } from './create-user.component';
import { ActivatedRoute } from '@angular/router';
import { Profile } from 'app/entities/profile';
import { Observable } from 'rxjs/Observable';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserComponent ],
      imports: [
        FormsModule,
        NgbModule.forRoot(),
      ],
      providers: [
        Location,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: CommonService, useValue: { profile: new Profile() } },
        { provide: ActivatedRoute, useValue: { params: Observable.of({idUser: -1}) } },
        { provide: HttpClient, useValue: { get: (idUser: string) => Observable.of(new Profile()) } }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    component.roles = [];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
