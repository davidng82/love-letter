const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();

  // Scenario A: narrow desktop viewport, plain mouse click (typical "responsive mode" resize, no touch)
  const contextA = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageA = await contextA.newPage();
  const errorsA = [];
  pageA.on('pageerror', e => errorsA.push(e.message));
  pageA.on('console', m => { if (m.type() === 'error') errorsA.push('console.error: ' + m.text()); });
  const filePath = 'file:///' + path.resolve(__dirname, 'birthday-envelope.html').replace(/\\/g, '/');
  await pageA.goto(filePath);
  await pageA.waitForTimeout(400);
  await pageA.locator('#envelope').click();
  await pageA.waitForTimeout(1200);
  const letterActiveA = await pageA.evaluate(() => document.getElementById('scene-letter').classList.contains('active'));
  console.log('Scenario A (narrow viewport, mouse click) letter active:', letterActiveA, 'errors:', errorsA);
  await contextA.close();

  // Scenario B: touch-capable narrow viewport but using a raw dispatch of touchstart/touchend (simulating a real phone tap sequence closely)
  const contextB = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const pageB = await contextB.newPage();
  const errorsB = [];
  pageB.on('pageerror', e => errorsB.push(e.message));
  await pageB.goto(filePath);
  await pageB.waitForTimeout(400);
  const box = await pageB.locator('#envelope').boundingBox();
  await pageB.touchscreen.tap(box.x + box.width/2, box.y + box.height/2);
  await pageB.waitForTimeout(1200);
  const letterActiveB = await pageB.evaluate(() => document.getElementById('scene-letter').classList.contains('active'));
  console.log('Scenario B (touchscreen.tap) letter active:', letterActiveB, 'errors:', errorsB);
  await contextB.close();

  // Scenario C: check computed --vh100 and stage size when there is NO real device toolbar difference, plus check for horizontal scroll / overlap of #music-toggle over envelope
  const contextC = await browser.newContext({ viewport: { width: 360, height: 640 }, hasTouch: true, isMobile: true }); // small older phone size
  const pageC = await contextC.newPage();
  await pageC.goto(filePath);
  await pageC.waitForTimeout(400);
  const stageBoxC = await pageC.locator('.stage').boundingBox();
  const envBoxC = await pageC.locator('#envelope').boundingBox();
  const musicBoxC = await pageC.locator('#music-toggle').boundingBox();
  console.log('Scenario C small phone 360x640 -> stage:', stageBoxC, 'envelope:', envBoxC, 'musicBtn:', musicBoxC);
  const overlap = !(musicBoxC.x + musicBoxC.width < envBoxC.x || musicBoxC.x > envBoxC.x + envBoxC.width || musicBoxC.y + musicBoxC.height < envBoxC.y || musicBoxC.y > envBoxC.y + envBoxC.height);
  console.log('music button overlaps envelope area:', overlap);
  await pageC.touchscreen.tap(envBoxC.x + envBoxC.width/2, envBoxC.y + envBoxC.height/2);
  await pageC.waitForTimeout(1200);
  const letterActiveC = await pageC.evaluate(() => document.getElementById('scene-letter').classList.contains('active'));
  console.log('Scenario C letter active after tap:', letterActiveC);
  await contextC.close();

  await browser.close();
})();
