import { element, by, browser, protractor, WebElement } from 'protractor';
import { Sector51LoginPage } from './login.po';
import { Sector51MenuPage } from './menu.po';

export class Sector51clientPage {
  readonly login: Sector51LoginPage;
  readonly menu: Sector51MenuPage;

  constructor() {
    this.login = new Sector51LoginPage();
    this.menu = new Sector51MenuPage();
  }

  init() {
    browser.debugger();
    browser.get('/');
  }

  textChar(text: string, char: string) {
    const length = 50;
    let line = '\n';
    let piece = char;
    for (let i = 0; i < length; i ++) {
      line += char;
    }
    line += '\n';

    for (let i = 0; i < (length - text.length - 2) / 2; i++) {
      piece += ' ';
    }

    return line + (text.length % 2 === 0 ? piece : piece.substring(0, piece.length - 1)) +
      text + piece.split('').reverse().join('') + line;
  }
}
