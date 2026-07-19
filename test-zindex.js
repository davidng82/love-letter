const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const iPhone = devices['iPhone 13'];
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...iPhone, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, 'valentine-gift.html').split(path.sep).join('/');
  await page.goto(filePath);
  await page.waitForTimeout(300);
  await page.locator('#envelope').tap();
  await page.waitForTimeout(500);

  const closeBtnBox = await page.locator('#scene-letter .close-btn').boundingBox();
  const musicBox = await page.locator('#music-toggle').boundingBox();
  console.log('close-btn box:', closeBtnBox);
  console.log('music-toggle box:', musicBox);

  const topEl = await page.evaluate(({x,y}) => {
    const el = document.elementFromPoint(x, y);
    return el ? el.outerHTML.slice(0, 120) : null;
  }, { x: closeBtnBox.x + closeBtnBox.width/2, y: closeBtnBox.y + closeBtnBox.height/2 });
  console.log('element at close-btn corner point:', topEl);

  await browser.close();
})();
