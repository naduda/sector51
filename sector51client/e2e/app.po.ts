import { element, by, browser, protractor, WebElement } from 'protractor';
import { Sector51LoginPage } from './login.po';
import { UserPage } from './user.po';

export class Sector51clientPage {
  readonly login: Sector51LoginPage;
  readonly user: UserPage;

  constructor() {
    this.login = new Sector51LoginPage();
    this.user = new UserPage();
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
