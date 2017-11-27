import { WebElement, element, by, browser } from 'protractor';
import { ABase, USER } from './ABase';
import { ERole, ESex } from '../src/app/entities/common';

export class Sector51MenuPage extends ABase {
  private readonly username: WebElement;
  private readonly profile: WebElement;
  private readonly menuUser: WebElement;
  private readonly addUserLink: WebElement;

  constructor() {
    super(false);
    this.username = element(by.css('sector51-toolbar a.dropdown-toggle > span'));
    this.profile = element(by.css('sector51-toolbar a.dropdown-item > i.fa-user'));
    this.menuUser = element(by.css('sector51-toolbar div.d-inline-block.user > i'));
    this.addUserLink = element(by.css('sector51-toolbar a[routerLink="/registration"]'));
  }

  test(): void {
    this.openMainPage();
    this.checkProfileIsLoaded();
    this.checkProfileNavigate();
    this.addUser('login', 'name', 'surname', '+380502222225',
                 'ng@qa.test', 'psw', '2', ERole.ADMIN, ERole.USER, ESex.MAN);
    this.updateUser('login', 'NewName', 'NewSurname', '+380502222226',
                    'new.ng@qa.test', 'newpsw', '3', ERole.USER, ERole.ADMIN, ESex.WOMAN);
    this.deleteUser('login');
  }

  checkProfileIsLoaded(printText?: boolean) {
    printText = printText === undefined || true;
    expect(this.username.getText()).toEqual(USER.name);
    if (printText) {
      this.printText('Check load profile');
    }
  }

  checkProfileNavigate() {
    this.username.click();
    this.profile.click();
    this.checkUrl('/registration/');
    this.printText('Navigate to profile page');
    this.openMainPage();
    this.checkProfileIsLoaded(false);
  }

  addUser(login: string, name: string, surname: string, phone: string,
          email: string, psw: string, card: string, role: ERole, oldRole: ERole, sex: ESex) {
    expect(element.all(by.css('sector51-main split-area ul > li')).count()).toBe(1);
    expect(element(by.css('sector51-main split-area ul > li')).isDisplayed()).toBeTruthy();
    this.menuUser.click();
    this.addUserLink.click();
    this.checkUrl('/registration');
    element(by.css('form input[name="login"]')).sendKeys(login);
    element(by.css('form input[name="name"]')).sendKeys(name);
    element(by.css('form input[name="surname"]')).sendKeys(surname);
    element(by.css('form input[name="phone"]')).sendKeys(phone);
    element(by.css('form input[name="email"]')).sendKeys(email);
    element(by.css('form input[name="password"]')).sendKeys(psw);
    element(by.css('form input[name="password2"]')).sendKeys(psw);
    element(by.css('form input[name="card"]')).sendKeys(card);
    element(by.css('div.form-group.row:nth-child(9) > div:first-child > div > i')).click();
    element(by.css('input[value="' + ERole[role] + '"]')).click();
    expect(element(by.css('div.form-group.row:nth-child(9) > div:first-child i.text-right')).getText())
      .toEqual(ERole[role], 'should be new role');
    element(by.css('div.form-group.row:nth-child(9) > div:last-child > div > i')).click();
    element(by.css('input[value="' + ESex[sex] + '"]')).click();
    expect(element(by.css('div.form-group.row:nth-child(9) > div:last-child i.text-right')).getText())
      .toEqual(ESex[sex], 'should be new role');
    element(by.css('button[type="submit"]')).click();
    this.checkUrl('/main');
    expect(element.all(by.css('sector51-main split-area ul > li')).count()).toBe(2);
    this.printText('User was added successful');
  }

  updateUser(login: string, name: string, surname: string, phone: string,
             email: string, psw: string, card: string, role: ERole, oldRole: ERole, sex: ESex) {
    expect(element.all(by.css('sector51-main split-area ul > li')).count()).toBeGreaterThan(0);
    element(by.css('sector51-main label > input')).click();
    this.openCreateUserForm(login);
    this.setInput('form input[name="name"]', name);
    this.setInput('form input[name="surname"]', surname);
    this.setInput('form input[name="phone"]', phone);
    this.setInput('form input[name="email"]', email);
    this.setInput('form input[name="card"]', card);
    element(by.css('div.form-group.row:nth-child(9) > div:first-child > div > i')).click();
    element(by.css('input[value="' + ERole[role] + '"]')).click();
    element(by.css('div.form-group.row:nth-child(9) > div:last-child > div > i')).click();
    element(by.css('input[value="' + ESex[sex] + '"]')).click();
    element(by.css('button[type="submit"]')).click();
    this.openCreateUserForm(login);
    this.expectInput('form input[name="name"]', name);
    this.expectInput('form input[name="surname"]', surname);
    this.expectInput('form input[name="phone"]', phone);
    this.expectInput('form input[name="email"]', email);
    this.expectInput('form input[name="card"]', card);
    expect(element(by.css('div.form-group.row:nth-child(9) > div:first-child > div > i')).getText())
      .toEqual(ERole[role]);
    expect(element(by.css('div.form-group.row:nth-child(9) > div:last-child > div > i')).getText())
      .toEqual(ESex[sex]);
    this.setInput('form input[name="password"]', psw);
    element(by.css('button[type="submit"]')).click();
    this.printText('User was updated successful');
  }

  deleteUser(login: string) {
    this.checkUrl('/main');
    expect(element.all(by.css('sector51-main split-area ul > li')).count()).toBe(2);
    expect(element(by.css('li[title="' + login + '"]'))).toBeTruthy();
    element(by.css('li[title="' + login + '"]')).click();
    element(by.css('button.btn-danger')).click();
    element(by.css('ngb-modal-window button.btn-primary')).click();
    expect(element.all(by.css('sector51-main split-area ul > li')).count()).toBe(1);
    this.printText('User was deleted successful');
  }

  openCreateUserForm(login: string) {
    this.checkUrl('/main');
    expect(element(by.css('li[title="' + login + '"]'))).toBeTruthy();
    element(by.css('li[title="' + login + '"]')).click();
    element(by.css('a.card-link.text-info')).click();
    this.checkUrl('/registration/');
  }

  setInput(selector: string, value) {
    const el = element(by.css(selector));
    return el.clear().then(() => el.sendKeys(value));
  }

  expectInput(selector: string, value) {
    const el = element(by.css(selector));
    expect(el.getAttribute('value')).toEqual(value);
  }
}
