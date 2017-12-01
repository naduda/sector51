import { WebElement, element, by, browser } from 'protractor';
import { ABase, USER } from './ABase';
import { ERole, ESex } from '../src/app/entities/common';
import { promise } from 'selenium-webdriver';

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
      .then(success => success && this.checkProfileIsLoaded(true))
      .then(success => success && this.checkProfileNavigate())
      .then(success => success && this.addUser('name', 'surname', '+380502222225',
                     'ng@qa.test', 'psw', '2', ERole.ADMIN, ERole.USER, ESex.MAN))
      .then(success => success && this.updateUser('2', 'NewName', 'NewSurname', '+380502222226',
                        'new.ng@qa.test', 'newpsw', '3', ERole.USER, ERole.ADMIN, ESex.WOMAN))
      .then(success => success && this.deleteUser('3'))
      .then(success => !success && this.printText('Something wrong in Sector51MenuPage'));
  }

  checkProfileIsLoaded(printText: boolean): promise.Promise<boolean> {
    printText && this.printText('Check load profile');
    return this.username.getText().then(text => text === USER.name);
  }

  checkProfileNavigate() {
    this.username.click();
    this.profile.click();
    this.checkUrl('/registration/');
    this.printText('Navigate to profile page');
    this.openMainPage();
    return this.checkProfileIsLoaded(false);
  }

  addUser(name: string, surname: string, phone: string, email: string, psw: string,
          card: string, role: ERole, oldRole: ERole, sex: ESex): promise.Promise<boolean> {
    return element.all(by.css('sector51-main split-area ul > li')).count()
      .then(count => count === 1)
      .then(success => success && element(by.css('sector51-main split-area ul > li')).isDisplayed())
      .then(success => {
        if (!success) return false;
        this.menuUser.click();
        this.addUserLink.click();
        return this.checkUrl('/registration');
      })
      .then(success => {
        if (!success) return false;
        element(by.css('form input[name="name"]')).sendKeys(name);
        element(by.css('form input[name="surname"]')).sendKeys(surname);
        element(by.css('form input[name="phone"]')).sendKeys(phone);
        element(by.css('form input[name="email"]')).sendKeys(email);
        element(by.css('form input[name="password"]')).sendKeys(psw);
        element(by.css('form input[name="password2"]')).sendKeys(psw);
        element(by.css('form input[name="card"]')).sendKeys(card);
        element(by.css('#divAuthorities > div > i.text-right')).click();
        element(by.css('input[value="' + ERole[role] + '"]')).click();
        return element(by.css('#divAuthorities > div > i.text-right')).getText().then(text => text === ERole[role]);
      })
      .then(success => {
        if (!success) return false;
        element(by.css('#divGender > div > i.text-right')).click();
        element(by.css('input[value="' + ESex[sex] + '"]')).click();
        return element(by.css('#divGender > div > i.text-right')).getText().then(text => text === ESex[sex]);
      })
      .then(success => {
        if (!success) return false;
        element(by.css('button[type="submit"]')).click();
        return this.checkUrl('/main');
      })
      .then(success => {
        if (!success) return false;
        return element.all(by.css('sector51-main split-area ul > li')).count().then(count => count === 2);
      })
      .then(success => {
        if (!success) return false;
        this.printText('User was added successful');
        return true;
      });
  }

  updateUser(oldCard: string, name: string, surname: string, phone: string, email: string, psw: string,
             card: string, role: ERole, oldRole: ERole, sex: ESex): promise.Promise<boolean> {
    return element.all(by.css('sector51-main split-area ul > li')).count().then(count => count > 0)
      .then(success => {
        if (!success) return false;
        element(by.css('sector51-main label > input')).click();
        return this.openCreateUserForm(oldCard);
      })
      .then(success => {
        if (!success) return false;
        this.setInput('form input[name="name"]', name);
        this.setInput('form input[name="surname"]', surname);
        this.setInput('form input[name="phone"]', phone);
        this.setInput('form input[name="email"]', email);
        this.setInput('form input[name="card"]', card);
        element(by.css('#divAuthorities > div > i.text-right')).click();
        element(by.css('input[value="' + ERole[role] + '"]')).click();
        element(by.css('#divGender > div > i.text-right')).click();
        element(by.css('input[value="' + ESex[sex] + '"]')).click();
        element(by.css('button[type="submit"]')).click();
        return this.openCreateUserForm(card);
      })
      .then(success => {
        if (!success) return false;
        this.expectInput('form input[name="name"]', name);
        this.expectInput('form input[name="surname"]', surname);
        this.expectInput('form input[name="phone"]', phone);
        this.expectInput('form input[name="email"]', email);
        this.expectInput('form input[name="card"]', card);
        return element(by.css('#divAuthorities > div > i')).getText().then(text => text === ERole[role]);
      })
      .then(success => success && element(by.css('#divGender > div > i')).getText().then(t => t === ESex[sex]))
      .then(success => {
        if (!success) return false;
        this.setInput('form input[name="password"]', psw);
        element(by.css('button[type="submit"]')).click();
        this.printText('User was updated successful');
        return true;
      });
  }

  deleteUser(card: string): promise.Promise<boolean> {
    return this.checkUrl('/main')
      .then(success => success && element.all(by.css('sector51-main split-area ul > li')).count().then(c => c === 2))
      .then(success => success && element(by.css('li[title="' + card + '"]')).isPresent())
      .then(success => {
        if (!success) return false;
        element(by.css('li[title="' + card + '"]')).click();
        element(by.css('button.btn-danger')).click();
        element(by.css('ngb-modal-window button.btn-primary')).click();
        return element.all(by.css('sector51-main split-area ul > li')).count().then(count => count === 1);
      })
      .then(success => {
        if (!success) return false;
        this.printText('User was deleted successful');
        return true;
      });
  }

  openCreateUserForm(card: string): promise.Promise<boolean> {
    this.checkUrl('/main');
    expect(element(by.css('li[title="' + card + '"]'))).toBeTruthy();
    element(by.css('li[title="' + card + '"]')).click();
    element(by.css('a.card-link.text-info')).click();
    return this.checkUrl('/registration/');
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
