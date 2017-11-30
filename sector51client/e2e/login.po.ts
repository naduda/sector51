import { element, by, WebElement } from 'protractor';
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
    this.loginAsUser('wrongUser', 'wrongPassword');
    this.checkUrl('/login');
    expect(element(by.className('alert alert-danger')).isPresent()).toBeTruthy();
    this.printText('Check unsuccess login');

    this.loginAsUser('owner', 'owner');
    this.checkUrl('/main');
    this.printText('Check success login');

    this.elementClick('sector51-toolbar a.dropdown-toggle > i.fa-user');
    this.elementClick('sector51-toolbar a.dropdown-item > i.fa-sign-out');
    this.checkUrl('/login');
    expect(element(by.className('alert alert-danger')).isPresent()).toBeFalsy();
    this.printText('Check logout');
  }
}
