import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.evaluate(async () => {
  const step = innerHeight * 0.75;
  for (let y = 0; y <= document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
});
await p.waitForTimeout(600);
const r = await p.evaluate(() => {
  const cs = s => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
  const box = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  return {
    mqMatches: matchMedia('(max-width: 48em)').matches,
    collageCols: cs('.collage').gridTemplateColumns,
    collageW: box('.collage'),
    itemA: box('.collage-item--a'), itemB: box('.collage-item--b'), itemC: box('.collage-item--c'),
    imgAcs: (() => { const i = document.querySelector('.collage-item--a img'); const c = getComputedStyle(i); return { w: c.width, h: c.height, scale: c.scale, transform: c.transform }; })(),
    figAcs: (() => { const f = document.querySelector('.collage-item--a'); const c = getComputedStyle(f); return { aspectRatio: c.aspectRatio, alignSelf: c.alignSelf, gridColumn: c.gridColumnStart + '/' + c.gridColumnEnd }; })(),
    docScrollW: document.documentElement.scrollWidth,
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
