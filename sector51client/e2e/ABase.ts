import { element, by, browser, protractor, WebElement, promise } from 'protractor';

export interface ITest { test(): void; }
export const USER = {name: 'rightOwner', password: 'owner'};

export abstract class ABase implements ITest {
  private counter = 0;
  private isDebug: boolean;

  constructor(isDebug?: boolean) {
    this.isDebug = isDebug === undefined ? true : isDebug;
  }

  abstract test(): void;

  openMainPage(): promise.Promise<boolean> {
    const sectorLink = element(by.css('.navbar-brand > a'));
    sectorLink.isPresent()
      .then(present => present ? sectorLink.click() : browser.get('/#/main'));
    browser.waitForAngular();
    return browser.getCurrentUrl()
      .then(url => url.includes('/main') ? null : this.loginAsUser())
      .then(() => this.checkUrl('/main'));
  }

  loginAsUser(name?: string, psw?: string) {
    const username = element(by.name('username'));
    const password = element(by.name('password'));
    this.clearElement(username);
    this.clearElement(password);
    username.sendKeys(name || USER.name);
    password.sendKeys(psw || USER.password);
    this.elementClick('form button');
    return browser.waitForAngular();
  }

  sleep(ms) {
    browser.sleep(this.isDebug ? ms : 0);
  }

  elementClick(selector: string) {
    const el = element(by.css(selector));
    el.isPresent().then(exist => {
      if (!exist) {
        console.log('Element not exist [%s]', selector);
      }
    });
    el.click();
  }

  printText(text: string, error?: boolean) {
    if (error) {
      console.error('\n' + text);
    } else {
      console.log('\t' + (++this.counter) + '. ' + text);
    }
  }

  clearElement(webElement: WebElement) {
    webElement.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, 'a'));
    webElement.sendKeys(protractor.Key.BACK_SPACE);
  }

  checkUrl(url: string): promise.Promise<boolean> {
    return browser.getCurrentUrl().then(result => result.includes(url));
  }

  navigateTo(path: string) {
    browser.get(path);
  }
}
