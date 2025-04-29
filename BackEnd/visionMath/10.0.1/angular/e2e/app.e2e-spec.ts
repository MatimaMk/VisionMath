import { visionMathTemplatePage } from './app.po';

describe('visionMath App', function() {
  let page: visionMathTemplatePage;

  beforeEach(() => {
    page = new visionMathTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
