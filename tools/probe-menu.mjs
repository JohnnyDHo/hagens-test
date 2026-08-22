import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
// Mobile menu
const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await m.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await m.waitForTimeout(1800);
await m.click('[data-menu-toggle]');
await m.waitForTimeout(800);
await m.screenshot({ path: '/tmp/menu-open.png' });
await m.keyboard.press('Escape');
await m.waitForTimeout(600);
const closedHidden = await m.evaluate(() => document.querySelector('[data-menu-overlay]').hidden);
console.log('overlay hidden after Escape:', closedHidden);
await m.close();
// Reduced motion
const rm = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await rm.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await rm.waitForTimeout(1500);
await rm.screenshot({ path: '/tmp/reduced-fold.png' });
const vidDisplay = await rm.evaluate(() => getComputedStyle(document.querySelector('.hero-video')).display);
console.log('reduced-motion video display:', vidDisplay);
await b.close();
