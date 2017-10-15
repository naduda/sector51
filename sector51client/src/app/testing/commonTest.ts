import { ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Profile } from '../entities/profile';
import { ERole } from '../entities/common';

export const USERS_MOCK = [
  new Profile('owner', 'Owner', 'SurnameO', '+380501111111', 'o@qa.test', '0111111111111', ERole.OWNER, true),
  new Profile('admin1', 'Admin', 'SurnameA', '+380502222222', 'a1@qa.test', '0222222222222', ERole.ADMIN, true),
  new Profile('admin2', 'Adimistrator', 'SurnameAdm', '+380503333333', 'a2@qa.test', '0222222222222', ERole.ADMIN),
  new Profile('user1', 'User', 'SurnameU', '+380504444444', 'u1@qa.test', '0444444444444', ERole.USER, true),
  new Profile('user2', 'First', 'SurnameF', '+380505555555', 'u2@qa.test', '0555555555555', ERole.USER, true),
  new Profile('user3', 'Second', 'SurnameS', '+380506666666', 'u3@qa.test', '0666666666666', ERole.USER, true),
  new Profile('user4', 'Third', 'SurnameTh', '+380507777777', 'u4@qa.test', '0777777777777', ERole.USER, true)
];

export class ElementTools<T> {
  constructor(private fixture: ComponentFixture<T>) {}

  all = (css: string) => this.fixture.debugElement.queryAll(By.css(css));
  de = (css: string) => this.fixture.debugElement.query(By.css(css));

  ne(css: string) {
    const res = this.de(css);
    return res ? res.nativeElement : undefined;
  };

  click(selector: string) {
    this.ne(selector).click();
    tick();
    this.fixture.detectChanges();
  }

  setInputValue(selector: string, value: string) {
    this.fixture.detectChanges();
    tick();
    const input = this.ne(selector);
    input.dispatchEvent(new Event('blur'));
    input.value = value;
    input.dispatchEvent(new Event('input'));
    tick();
    this.fixture.detectChanges();
  }
}
