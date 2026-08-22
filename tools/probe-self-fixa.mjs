#!/usr/bin/env node
// Targeted verification for self-fixA audit items.
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chromium' });

const checks = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, dsf: 2, mobile: true },
];

for (const vp of checks) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf || 1,
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4173/index.html', { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 600));
  });

  const data = await page.evaluate(() => {
    const out = {};
    const q = (s) => document.querySelector(s);

    // 1. kicker chip line count
    const chip = q('.hero-kicker');
    if (chip) {
      const lh = parseFloat(getComputedStyle(chip).lineHeight) || parseFloat(getComputedStyle(chip).fontSize) * 1.6;
      out.kickerHeightVsLine = +(chip.getBoundingClientRect().height / lh).toFixed(2);
      out.kickerText = chip.textContent.trim().replace(/\s+/g, ' ');
    }

    // 3. to-top hit height
    const toTop = q('.to-top');
    if (toTop) out.toTopHeight = Math.round(toTop.getBoundingClientRect().height);

    // 4. video credit color
    const vc = q('.video-credit');
    if (vc) out.videoCreditColor = getComputedStyle(vc).color;

    // 5. hero line 2 right edge
    const l2 = q('.hero-title .line--indent');
    if (l2) {
      const r = l2.getBoundingClientRect();
      out.heroL2RightGap = Math.round(window.innerWidth - r.right);
    }

    // 6. gap between interlude caption bottom and #disciplines top
    const cap = q('.interlude-caption');
    const disc = q('#disciplines');
    if (cap && disc) {
      out.interludeToSection = Math.round(disc.getBoundingClientRect().top - cap.getBoundingClientRect().bottom);
    }

    // 7. event dates text
    const ed = q('.event-dates');
    if (ed) out.eventDates = ed.textContent.trim().replace(/\s+/g, ' ');

    // 8. ig-handle overflow / break
    const ig = q('.ig-handle');
    if (ig) {
      out.igScrollOverflow = ig.scrollWidth - ig.clientWidth;
      out.igFontSizePx = +(+getComputedStyle(ig).fontSize.replace('px','')).toFixed(1);
      const range = document.createRange();
      range.selectNodeContents(ig);
      out.igClientRectCount = range.getClientRects().length;
    }

    // 2. footer address line boxes
    const addr = q('.footer-col address');
    if (addr) {
      const range = document.createRange();
      range.selectNodeContents(addr);
      out.addressLineRects = [...range.getClientRects()].filter(r => r.width > 2).length;
    }
    return out;
  });
  console.log(`--- ${vp.name} ---`);
  console.log(JSON.stringify(data, null, 2));

  // Screenshot the footer legal row region.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `shots/self-fixA/${vp.name}-footer.png` });
  await ctx.close();
}
await browser.close();
