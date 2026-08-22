import { chromium } from 'playwright';
const b = await chromium.launch({ channel: 'chromium' });
for (const vp of [{ name: 'desk', width: 1440, height: 900 }, { name: 'mob', width: 390, height: 844 }]) {
  const p = await b.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const H = await p.evaluate(() => document.body.scrollHeight);
  const step = Math.floor(vp.height * 0.85);
  for (let y = step, i = 1; y < H - vp.height + step; y += step, i++) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(900);
    await p.screenshot({ path: `/tmp/sec-${vp.name}-${String(i).padStart(2, '0')}.png` });
  }
  console.log(vp.name, 'height', H);
  await p.close();
}
await b.close();
