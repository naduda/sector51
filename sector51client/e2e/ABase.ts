import { element, by, browser, protractor, WebElement, promise } from 'protractor';

export interface ITest { test(): void; }
export const USER = {name: 'owner', password: 'owner'};

export abstract class ABase implements ITest {
  private counter = 0;
  private isDebug: boolean;

  constructor(isDebug?: boolean) {
    this.isDebug = isDebug === undefined ? true : isDebug;
  }

  abstract test(): void;

  openMainPage() {
    const sectorLink = element(by.css('.navbar-brand > a'));
    return sectorLink.isPresent()
      .then(present => present ? sectorLink.click() : browser.get('/#/main'))
      .then(() => browser.waitForAngular)
      .then(browser.getCurrentUrl)
      .then(url => url.includes('/main'))
      .then(isLogin => isLogin ? null : this.loginAsUser())
      .then(() => expect(browser.getCurrentUrl()).toContain('/main'))
      .then(() => this);
  }

  loginAsUser(name?: string, psw?: string) {
    const username = element(by.name('username'));
    const password = element(by.name('password'));
    return this.clearElement(username)
      .then(() => this.clearElement(password))
      .then(() => username.sendKeys(name || USER.name))
      .then(() => password.sendKeys(psw || USER.password))
      .then(() => this.sleep(1000))
      .then(element(by.css('form button')).click)
      .then(() => browser.waitForAngular());
  }

  sleep(ms) {
    return browser.sleep(this.isDebug ? ms : 0);
  }

  printText(text: string, error?: boolean) {
    if (error) {
      console.error('\n' + text);
    } else {
      console.log('\t' + (++this.counter) + '. ' + text);
    }
    return this.sleep(3000);
  }

  clearElement(element: WebElement) {
    return element.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'))
      .then(() => element.sendKeys(protractor.Key.BACK_SPACE));
  }

  checkUrl(url: string) {
    expect(browser.getCurrentUrl()).toContain(url);
  }

  navigateTo(path: string) {
    return browser.get(path);
  }
}
