const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const iPhone = devices['iPhone 13'];
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...iPhone,
  });
  const page = await context.newPage();

  const consoleMsgs = [];
  page.on('console', msg => consoleMsgs.push(`[console:${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleMsgs.push(`[pageerror] ${err.message}`));

  const filePath = 'file:///' + path.resolve(__dirname, 'birthday-envelope.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await page.waitForTimeout(500);

  console.log('--- viewport ---', page.viewportSize());

  const envelopeBox = await page.locator('#envelope').boundingBox();
  console.log('--- envelope boundingBox ---', envelopeBox);

  const stageBox = await page.locator('.stage').boundingBox();
  console.log('--- stage boundingBox ---', stageBox);

  // check what element is actually at the center point of the envelope (hit-test)
  const hit = await page.evaluate(({x, y}) => {
    const el = document.elementFromPoint(x, y);
    return el ? (el.id || el.className || el.tagName) : null;
  }, { x: envelopeBox.x + envelopeBox.width / 2, y: envelopeBox.y + envelopeBox.height / 2 });
  console.log('--- element at envelope center ---', hit);

  // try a real touch tap
  await page.locator('#envelope').tap();
  await page.waitForTimeout(1200);

  const letterActive = await page.evaluate(() => document.getElementById('scene-letter').classList.contains('active'));
  console.log('--- scene-letter active after tap ---', letterActive);

  console.log('--- console/page errors ---');
  consoleMsgs.forEach(m => console.log(m));

  await browser.close();
})();
