import { Sector51clientPage } from './app.po';
import { browser } from 'protractor';

describe('sector51client App', () => {
  const page = new Sector51clientPage();

  beforeEach(() => {
    page.init();
  });

  it(page.textChar('Sector51', '*'), () => expect(browser.getTitle()).toEqual('Sector51'));
  it(page.textChar('Login page', '·'), () => page.login.test());
  it(page.textChar('Navigation', '·'), () => page.menu.test());

  afterAll(() => {});
});
