const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const iPhone = devices['iPhone 13'];
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...iPhone });
  const page = await context.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  const filePath = 'file:///' + path.resolve(__dirname, 'valentine-gift.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await page.waitForTimeout(400);
  await page.locator('#envelope').tap();
  await page.waitForTimeout(1200);
  const letterActive = await page.evaluate(() => document.getElementById('scene-letter').classList.contains('active'));
  console.log('valentine-gift letter active after tap:', letterActive, 'errors:', errs);
  await browser.close();
})();
