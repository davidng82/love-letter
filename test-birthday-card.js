const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const iPhone = devices['iPhone 13'];
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...iPhone, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  const filePath = 'file:///' + path.resolve(__dirname, 'birthday-card.html').split(path.sep).join('/');
  await page.goto(filePath);
  await page.waitForTimeout(400);
  await page.locator('#cake').tap();
  await page.waitForTimeout(300);
  console.log('cake blown:', await page.evaluate(() => document.getElementById('cake').classList.contains('blown')));
  console.log('errors:', errs);
  await browser.close();
})();
