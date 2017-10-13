import { ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function setInputValue(selector: string, value: string, fixture: ComponentFixture<any>) {
  fixture.detectChanges();
  tick();
  const input = fixture.debugElement.query(By.css(selector)).nativeElement;
  input.dispatchEvent(new Event('blur'));
  input.value = value;
  input.dispatchEvent(new Event('input'));
  tick();
  fixture.detectChanges();
}
