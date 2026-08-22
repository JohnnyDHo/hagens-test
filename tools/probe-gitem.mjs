import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:4173/mason.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.evaluate(async () => {
  const step = window.innerHeight * 0.75;
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, document.querySelector('.gallery-strip').offsetTop);
  await new Promise((r) => setTimeout(r, 2500));
});
const data = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.g-item').forEach((fig) => {
    const img = fig.querySelector('img');
    const cap = fig.querySelector('figcaption');
    const ir = img.getBoundingClientRect();
    const cr = cap.getBoundingClientRect();
    out.push({
      imgW: +ir.width.toFixed(1),
      overlap: +(ir.bottom - cr.top).toFixed(1),
      transform: getComputedStyle(img).transform,
      inlineStyle: (img.getAttribute('style') || '').slice(0, 80),
    });
  });
  return out;
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
