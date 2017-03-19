import { KartoffelstampfClientPage } from './app.po';

describe('kartoffelstampf-client App', () => {
  let page: KartoffelstampfClientPage;

  beforeEach(() => {
    page = new KartoffelstampfClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
