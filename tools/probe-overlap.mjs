import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
// scroll through to fire reveals
await p.evaluate(async () => {
  const step = innerHeight * 0.75;
  for (let y = 0; y <= document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); }
  scrollTo(0, 0);
});
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  const g = s => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: b.top + scrollY, bottom: b.bottom + scrollY, h: b.height }; };
  return {
    collageA: g('.collage-item--a'), collageB: g('.collage-item--b'), collageC: g('.collage-item--c'),
    teamSection: g('#team'), partnersSection: g('#partners'), partnerGrid: g('.partner-grid'),
    heroTitleLine2: g('.hero-title .line--indent'),
    heroTitleW: (() => { const w = document.querySelector('.hero-title .line--indent .word'); const b = w.getBoundingClientRect(); return { w: b.width, right: b.right, vw: innerWidth }; })(),
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
