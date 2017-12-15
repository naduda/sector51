import { FocusDirective } from './focus.directive';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { ElementRef, Renderer, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { element } from 'protractor';
import { ElementTools } from '../testing/commonTest';

@Component({
  template: `
      <input type="number" [prFocus]="focusTest" value="0.151">
      <button>OK</button>
  `
})
class TestComponent {
  public focusTest: any = {
    onBlur: (element) => element.value = element.value ? Number(element.value).toFixed(2) : 0
  };
}

describe('FocusDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let et: ElementTools<TestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FocusDirective, TestComponent ],
      providers: [
        { provide: ElementRef, useValue: {} },
        { provide: Renderer, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    et = new ElementTools(fixture);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should change test in input', () => {
    const input = et.ne('input');
    input.value = '0.123';
    expect(input.value).toEqual('0.123');
    component.focusTest.eventEmitter.emit(false);
    expect(input.value).toEqual('0.12');
  });
});
