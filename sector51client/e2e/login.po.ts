import { element, by, WebElement, browser } from 'protractor';
import { ABase } from './ABase';

export class Sector51LoginPage extends ABase {
  private readonly username: WebElement;
  private readonly password: WebElement;
  private readonly button: WebElement;

  constructor() {
    super(false);
    this.username = element(by.name('username'));
    this.password = element(by.name('password'));
    this.button = element(by.css('form button'));
  }

  test(): void {
    this.loginAsUser('wrongUser', 'wrongPassword').then(() => this.checkUrl('/login'))
      .then(success => {
        if (!success) return false;
        expect(element(by.className('alert alert-danger')).isPresent()).toBeTruthy();
        this.printText('Check unsuccess login');
        return this.loginAsUser('rightOwner', 'owner').then(() => this.checkUrl('/main'));
      })
      .then(success => {
        if (!success) return false;
        this.printText('Check success login');
        this.elementClick('sector51-toolbar a.dropdown-toggle > i.fa-user');
        this.elementClick('sector51-toolbar a.dropdown-item > i.fa-sign-out');
        return this.checkUrl('/login');
      })
      .then(success => {
        if (!success) return false;
        browser.get('#/main');
        browser.waitForAngular();
        return this.checkUrl('/login');
      })
      .then(success => {
        if (!success) {
          this.printText('Something wrong in Sector51LoginPage');
          return;
        }
        this.printText('Check protection after logout');
        expect(element(by.className('alert alert-danger')).isPresent()).toBeFalsy();
        this.printText('Check logout');
      });
  }
}
