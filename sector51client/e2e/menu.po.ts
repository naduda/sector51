import { WebElement, element, by, browser } from 'protractor';
import { ABase, USER } from './ABase';
import { ERole } from '../src/app/entities/common';

export class Sector51MenuPage extends ABase {
  private readonly username: WebElement;
  private readonly profile: WebElement;
  private readonly menuUser: WebElement;
  private readonly addUserLink: WebElement;

  constructor() {
    super(!false);
    this.username = element(by.css('sector51-toolbar a.dropdown-toggle > span'));
    this.profile = element(by.css('sector51-toolbar a.dropdown-item > i.fa-user'));
    this.menuUser = element(by.css('sector51-toolbar div.d-inline-block.user > i'));
    this.addUserLink = element(by.css('sector51-toolbar a[routerLink="/registration"]'));
  }

  test(): void {
    this.openMainPage()
      .then(() => this.checkProfileIsLoaded())
      .then(() => this.checkProfileNavigate())
      .then(() => this.addUser('login', 'name', 'surname', '+380502222225', 'ng@qa.test', 'psw', 2, ERole.ADMIN));
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
      .then(() => this.checkUrl('/profile/' + USER.name))
      .then(() => this.printText('Navigate to profile page'))
      .then(() => this.openMainPage())
      .then(result => this.checkProfileIsLoaded(false));
  }

  addUser(login: string, name: string, surname: string, phone: string,
          email: string, psw: string, card: number, role: ERole) {
    expect(element.all(by.css('sector51-main div.users > ul > li')).count()).toBe(1);
    expect(element(by.css('sector51-main div.users > ul > li')).isDisplayed()).toBeFalsy();
    element(by.css('sector51-main >div > label')).click()
      .then(() => this.sleep(2000))
      .then(() => expect(element(by.css('sector51-main div.users > ul > li')).isDisplayed()).toBeTruthy())
      .then(this.menuUser.click)
      .then(() => browser.waitForAngular())
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
      .then(() => this.setRole(role))
      .then(() => expect(element(by.css('i.text-right')).getText()).toEqual(ERole[role]))
      .then(element(by.css('button[type="submit"]')).click)
      .then(() => browser.waitForAngular())
      .then(() => this.checkUrl('/main'))
      .then(() => expect(element.all(by.css('sector51-main div.users > ul > li')).count()).toBe(2));
  }

  setRole(role: ERole) {
    return element(by.css('i.text-right')).click()
      .then(element(by.css('input[value="USER"]')).click)
      .then(element(by.css('input[value="' + ERole[role] + '"]')).click)
      .then(element(by.css('i.text-right')).click);
  }
}
