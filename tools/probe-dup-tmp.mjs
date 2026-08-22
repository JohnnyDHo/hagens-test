import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
const ctx = await b.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:1 });
const p = await ctx.newPage();
await p.goto('http://localhost:4173/', { waitUntil:'networkidle' });
await p.waitForTimeout(2600);
await p.evaluate(async () => {
  const step = window.innerHeight * 0.75;
  for (let y=0;y<=document.body.scrollHeight;y+=step){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,100)); }
  window.scrollTo(0,0);
});
await p.waitForTimeout(800);
const h = await p.evaluate(() => document.body.scrollHeight);
await p.setViewportSize({ width: 390, height: Math.min(h, 16000) });
await p.waitForTimeout(1200);
const h2 = await p.evaluate(() => document.body.scrollHeight);
console.log('scrollHeight before/after resize:', h, h2);
await p.screenshot({ path:'/tmp/tall-mobile.png', clip: { x:0, y:0, width:390, height:h2 } });
await b.close();
