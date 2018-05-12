import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AbonementDialogComponent } from './abonement-dialog.component';

describe('AbonementDialogComponent', () => {
  let component: AbonementDialogComponent;
  let fixture: ComponentFixture<AbonementDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AbonementDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
