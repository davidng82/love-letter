const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const iPhone = devices['iPhone 13'];
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...iPhone, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));

  const filePath = 'file:///' + path.resolve(__dirname, 'birthday-envelope.html').split(path.sep).join('/');
  await page.goto(filePath);
  await page.waitForTimeout(300);

  await page.locator('#envelope').tap();
  await page.waitForTimeout(800);
  console.log('1) letter active:', await page.evaluate(() => document.getElementById('scene-letter').classList.contains('active')));

  await page.locator('#to-qr').tap();
  await page.waitForTimeout(600);
  console.log('2) qr scene active:', await page.evaluate(() => document.getElementById('scene-qr').classList.contains('active')));

  const qrCanvasBox = await page.locator('#qr-canvas').boundingBox();
  console.log('3) qr canvas rendered box:', qrCanvasBox);

  await page.locator('#scene-qr .close-btn').tap();
  await page.waitForTimeout(700);
  console.log('4) back to envelope active:', await page.evaluate(() => document.getElementById('scene-envelope').classList.contains('active')));

  await page.locator('#envelope').tap();
  await page.waitForTimeout(800);
  console.log('5) letter active again after re-open:', await page.evaluate(() => document.getElementById('scene-letter').classList.contains('active')));

  await page.locator('#music-toggle').tap();
  await page.waitForTimeout(200);
  console.log('6) music toggled pressed state:', await page.evaluate(() => document.getElementById('music-toggle').getAttribute('aria-pressed')));

  console.log('errors:', errs);
  await browser.close();
})();
