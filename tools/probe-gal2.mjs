import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto('http://localhost:4173/gallery.html', { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
await p.waitForTimeout(2000);
const r = await p.evaluate(() => {
  const g = document.querySelector('.arch-grid');
  const items = [...g.querySelectorAll('.a-item')];
  const cs = getComputedStyle(g);
  return {
    items: items.length,
    scrollable: g.scrollWidth > g.clientWidth,
    overflowX: g.scrollWidth - g.clientWidth,
    snapType: cs.scrollSnapType,
    display: cs.display,
    frameHeights: [...new Set(items.map(i => Math.round(i.querySelector('.a-frame').getBoundingClientRect().height)))],
    itemWidths: [...new Set(items.map(i => Math.round(i.getBoundingClientRect().width)))],
    heroH: Math.round(document.querySelector('.hero--archive').getBoundingClientRect().height),
    titleTop: Math.round(document.querySelector('.hero-title').getBoundingClientRect().top),
    ticker: !!document.querySelector('.ticker'),
    locColor: getComputedStyle(document.querySelector('.a-item figcaption span:last-child')).color,
    capColor: getComputedStyle(document.querySelector('.a-item figcaption span:first-child')).color,
  };
});
console.log(JSON.stringify(r, null, 2));

await b.close();
