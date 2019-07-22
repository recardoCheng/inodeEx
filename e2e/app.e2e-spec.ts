import { InodeExPage } from './app.po';

describe('inode-ex App', () => {
  let page: InodeExPage;

  beforeEach(() => {
    page = new InodeExPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
