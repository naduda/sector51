import { element, by, browser, WebElement, promise } from 'protractor';
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
    this.checkUserEnter('qwe', 'qwe', '/login')
      .then(() => this.unSuccessLogin())
      .then(() => this.checkUserEnter('owner', 'owner', '/main'))
      .then(() => this.logout());
  }

  private unSuccessLogin() {
    this.checkUrl('/login');
    expect(element(by.className('alert alert-danger')).isPresent()).toBeTruthy();
    expect(element(by.className('alert alert-danger')).getText())
      .toEqual('Username or password is incorrect');
    this.printText('Check unsuccess login');
  }

  private checkUserEnter(name: string, password: string, expectedUrl: string) {
    return this.loginAsUser(name, password)
      .then(() => this.checkUrl(expectedUrl));
  }

  private logout() {
    return element(by.css('sector51-toolbar a.dropdown-toggle > i.fa-user')).click()
      .then(() => element(by.css('sector51-toolbar a.dropdown-item > i.fa-sign-out')).click())
      .then(() => this.printText('Check success login'))
      .then(() => expect(browser.getCurrentUrl()).toContain('/login'))
      .then(() => expect(element(by.className('alert alert-danger')).isPresent()).toBeFalsy())
      .then(() => this.printText('Check logout'));
    }
}
