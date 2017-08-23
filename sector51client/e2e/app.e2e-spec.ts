import { Sector51clientPage } from './app.po';

describe('sector51client App', () => {
  let page: Sector51clientPage;

  beforeEach(() => {
    page = new Sector51clientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
