import { WebElement, element, by, browser } from 'protractor';
import { ABase, USER } from './ABase';

export class Sector51MenuPage extends ABase {
  private readonly username: WebElement;
  private readonly profile: WebElement;

  constructor() {
    super(false);
    this.username = element(by.css('sector51-toolbar a.dropdown-toggle > span'));
    this.profile = element(by.css('sector51-toolbar a.dropdown-item > i.fa-user'));
  }

  test(): void {
    this.openMainPage()
      .then(this.checkProfileIsLoaded)
      .then(this.checkProfileNavigate);
  }

  checkProfileIsLoaded(__this: Sector51MenuPage, printText?: boolean) {
    printText = printText === undefined || true;
    return __this.username.getText()
      .then(name => expect(name).toEqual(USER.name))
      .then(() => printText ? __this.printText('Check load profile') : null)
      .then(() => __this);
  }

  checkProfileNavigate(__this: Sector51MenuPage) {
    return __this.username.click()
      .then(__this.profile.click)
      .then(() => __this.checkUrl('/profile/' + USER.name))
      .then(() => __this.printText('Navigate to profile page'))
      .then(__this.openMainPage)
      .then(result => __this.checkProfileIsLoaded(__this, false));
  }
}
