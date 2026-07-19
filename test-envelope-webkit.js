const { webkit, devices } = require('playwright');
const path = require('path');

(async () => {
  const iPhone = devices['iPhone 13'];
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...iPhone });
  const page = await context.newPage();

  const msgs = [];
  page.on('console', m => msgs.push(`[${m.type()}] ${m.text()}`));
  page.on('pageerror', e => msgs.push(`[pageerror] ${e.message}`));

  const filePath = 'file:///' + path.resolve(__dirname, 'birthday-envelope.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await page.waitForTimeout(500);

  console.log('viewport:', page.viewportSize());
  const stageBox = await page.locator('.stage').boundingBox();
  const envBox = await page.locator('#envelope').boundingBox();
  console.log('stage:', stageBox);
  console.log('envelope:', envBox);

  // Check computed style of key properties that might silently fail in WebKit
  const computed = await page.evaluate(() => {
    const stage = document.querySelector('.stage');
    const cs = getComputedStyle(stage);
    return {
      width: cs.width,
      height: cs.height,
      aspectRatio: cs.aspectRatio,
    };
  });
  console.log('computed stage style:', computed);

  const vh100 = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--vh100'));
  console.log('--vh100 value:', vh100);

  await page.locator('#envelope').tap();
  await page.waitForTimeout(1200);
  const letterActive = await page.evaluate(() => document.getElementById('scene-letter').classList.contains('active'));
  console.log('letter active after tap:', letterActive);

  console.log('console/page messages:');
  msgs.forEach(m => console.log(m));

  await browser.close();
})();
