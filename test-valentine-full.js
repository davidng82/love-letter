const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const iPhone = devices['iPhone 13'];
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...iPhone, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));

  const filePath = 'file:///' + path.resolve(__dirname, 'valentine-gift.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await page.waitForTimeout(300);

  await page.locator('#envelope').tap();
  await page.waitForTimeout(800);
  console.log('1) letter active:', await page.evaluate(() => document.getElementById('scene-letter').classList.contains('active')));

  await page.locator('#to-garden').tap();
  await page.waitForTimeout(600);
  console.log('2) garden active:', await page.evaluate(() => document.getElementById('scene-garden').classList.contains('active')));

  await page.locator('[data-tab="album"]').tap();
  await page.waitForTimeout(300);
  console.log('3) album panel active:', await page.evaluate(() => document.querySelector('[data-panel="album"]').classList.contains('active')));

  await page.locator('[data-tab="rose"]').tap();
  await page.waitForTimeout(300);
  console.log('4) rose panel active again:', await page.evaluate(() => document.querySelector('[data-panel="rose"]').classList.contains('active')));

  await page.locator('#scene-garden .close-btn').tap();
  await page.waitForTimeout(700);
  console.log('5) back to envelope active:', await page.evaluate(() => document.getElementById('scene-envelope').classList.contains('active')));

  // tap envelope again to make sure it still works after a full reset
  await page.locator('#envelope').tap();
  await page.waitForTimeout(800);
  console.log('6) letter active again after re-open:', await page.evaluate(() => document.getElementById('scene-letter').classList.contains('active')));

  console.log('errors:', errs);
  await browser.close();
})();
