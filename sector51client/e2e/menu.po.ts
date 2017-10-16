import { WebElement, element, by, browser } from 'protractor';
import { ABase, USER } from './ABase';
import { ERole } from '../src/app/entities/common';

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
    this.openMainPage()
      .then(() => this.checkProfileIsLoaded())
      .then(() => this.checkProfileNavigate())
      .then(() => this.addUser('login', 'name', 'surname', '+380502222225', 
                               'ng@qa.test', 'psw', '2', ERole.ADMIN, ERole.USER))
      .then(() => this.updateUser('login', 'NewName', 'NewSurname', '+380502222226',
                                  'new.ng@qa.test', 'newpsw', '3', ERole.USER, ERole.ADMIN))
      .then(() => this.deleteUser('login'));
  }

  checkProfileIsLoaded(printText?: boolean) {
    printText = printText === undefined || true;
    return this.username.getText()
      .then(name => expect(name).toEqual(USER.name))
      .then(() => printText ? this.printText('Check load profile') : null);
  }

  checkProfileNavigate() {
    return this.username.click()
      .then(this.profile.click)
      .then(() => this.checkUrl('/registration/'))
      .then(() => this.printText('Navigate to profile page'))
      .then(() => this.openMainPage())
      .then(result => this.checkProfileIsLoaded(false));
  }

  addUser(login: string, name: string, surname: string, phone: string,
          email: string, psw: string, card: string, role: ERole, oldRole: ERole) {
    expect(element.all(by.css('sector51-main div.users > ul > li')).count()).toBe(1);
    expect(element(by.css('sector51-main div.users > ul > li')).isDisplayed()).toBeFalsy();
    element(by.css('sector51-main > div > label')).click()
      .then(() => expect(element(by.css('sector51-main div.users > ul > li')).isDisplayed()).toBeTruthy())
      .then(this.menuUser.click)
      .then(this.addUserLink.click)
      .then(() => this.checkUrl('/registration'))
      .then(() => element(by.css('form input[name="login"]')).sendKeys(login))
      .then(() => element(by.css('form input[name="name"]')).sendKeys(name))
      .then(() => element(by.css('form input[name="surname"]')).sendKeys(surname))
      .then(() => element(by.css('form input[name="phone"]')).sendKeys(phone))
      .then(() => element(by.css('form input[name="email"]')).sendKeys(email))
      .then(() => element(by.css('form input[name="password"]')).sendKeys(psw))
      .then(() => element(by.css('form input[name="password2"]')).sendKeys(psw))
      .then(() => element(by.css('form input[name="card"]')).sendKeys(card))
      .then(element(by.css('i.text-right')).click)
      .then(element(by.css('input[value="' + ERole[role] + '"]')).click)
      .then(() => expect(element(by.css('i.text-right')).getText()).toEqual(ERole[role], 'should be new role'))
      .then(element(by.css('button[type="submit"]')).click)
      .then(() => this.checkUrl('/main'))
      .then(() => expect(element.all(by.css('sector51-main div.users > ul > li')).count()).toBe(2))
      .then(() => this.printText('User was added successful'));
  }

  updateUser(login: string, name: string, surname: string, phone: string,
             email: string, psw: string, card: string, role: ERole, oldRole: ERole) {
    expect(element.all(by.css('sector51-main div.users > ul > li')).count()).toBeGreaterThan(0);
    this.openCreateUserForm(login)
      .then(() => this.setInput('form input[name="name"]', name))
      .then(() => this.setInput('form input[name="surname"]', surname))
      .then(() => this.setInput('form input[name="phone"]', phone))
      .then(() => this.setInput('form input[name="email"]', email))
      .then(() => this.setInput('form input[name="card"]', card))
      .then(element(by.css('i.text-right')).click)
      .then(element(by.css('input[value="' + ERole[role] + '"]')).click)
      .then(element(by.css('button[type="submit"]')).click)
      .then(() => this.openCreateUserForm(login))
      .then(() => this.expectInput('form input[name="name"]', name))
      .then(() => this.expectInput('form input[name="surname"]', surname))
      .then(() => this.expectInput('form input[name="phone"]', phone))
      .then(() => this.expectInput('form input[name="email"]', email))
      .then(() => this.expectInput('form input[name="card"]', card))
      .then(() => expect(element(by.css('form div.d-inline-block.dropdown > i'))
                    .getText()).toEqual(ERole[role]))
      .then(() => this.setInput('form input[name="password"]', psw))
      .then(element(by.css('button[type="submit"]')).click)
      .then(() => this.printText('User was updated successful'));
  }

  deleteUser(login: string) {
    this.checkUrl('/main');
    expect(element.all(by.css('sector51-main div.users > ul > li')).count()).toBe(2);
    expect(element.all(by.css('sector51-main div.users > ul > li')).count()).toBeGreaterThan(0);
    expect(element(by.css('li[title="' + login + '"]'))).toBeTruthy();
    element(by.css('li[title="' + login + '"]')).click()
      .then(element(by.css('button.btn-danger')).click)
      .then(element(by.css('ngb-modal-window button.btn-primary')).click)
      .then(() => expect(element.all(by.css('sector51-main div.users > ul > li')).count()).toBe(1))
      .then(() => this.printText('User was deleted successful'));
  }

  openCreateUserForm(login: string) {
    this.checkUrl('/main');
    expect(element(by.css('li[title="' + login + '"]'))).toBeTruthy();
    return element(by.css('li[title="' + login + '"]')).click()
      .then(element(by.css('a.card-link.text-info')).click)
      .then(() => this.checkUrl('/registration/'));
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
