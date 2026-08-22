import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('console', m => console.log('PAGE:', m.text()));
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1000);
const count = () => p.evaluate(() =>
  [...document.querySelectorAll('[data-reveal]')].filter(el => getComputedStyle(el).opacity === '0').length
);
console.log('at top:', await count());
await p.evaluate(async () => {
  const step = window.innerHeight * 0.75;
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 120));
  }
});
await p.waitForTimeout(1200);
console.log('at bottom:', await count());
const sample = await p.evaluate(() => {
  const bad = [...document.querySelectorAll('[data-reveal]')]
    .filter(el => getComputedStyle(el).opacity === '0')
    .slice(0, 6)
    .map(el => ({ cls: el.className.slice(0,40), inlineOp: el.style.opacity,
                  docTop: Math.round(el.getBoundingClientRect().top + window.scrollY),
                  stAlive: ScrollTrigger.getAll().some(s => s.trigger === el) }));
  return bad;
});
console.log(JSON.stringify(sample, null, 1));
await b.close();
