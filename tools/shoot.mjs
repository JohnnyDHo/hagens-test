#!/usr/bin/env node
// Blind A/B screenshot rig.
// Usage: node shoot.mjs --manifest <manifest.json> [--outdir shots] [--reduced-motion]
//
// Manifest:
// {
//   "viewports": [ { "name":"desktop", "width":1440, "height":900 },
//                  { "name":"mobile", "width":390, "height":844, "dsf":3 } ],
//   "targets": [ { "label":"A", "baseURL":"http://localhost:4173",
//                  "pages":[{ "path":"/", "name":"home" }] } ]
// }
// Writes <outdir>/<label>/<viewport>/<name>.png (full page) and <name>-fold.png (viewport).

import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
function arg(name) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
}
const hasFlag = (n) => args.includes(`--${n}`);

const manifestPath = arg('manifest');
if (!manifestPath) {
  console.error('manifest required');
  process.exit(1);
}
const outdir = arg('outdir') || 'shots';
const reducedMotion = hasFlag('reduced-motion');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const viewports = manifest.viewports || [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844, dsf: 3 },
];

await mkdir(outdir, { recursive: true });

const browser = await chromium.launch({ channel: 'chromium' });

for (const target of manifest.targets) {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dsf || 2,
      isMobile: !!vp.mobile,
      hasTouch: !!vp.mobile,
      reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
      userAgent: vp.mobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : undefined,
    });
    const page = await context.newPage();
    for (const pg of target.pages || []) {
      const url = new URL(pg.path, target.baseURL).href;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      } catch {
        await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
      }
      // Settle hero/intro animations.
      await page.waitForTimeout(2500);
      // Scroll through the page so scroll-triggered animations fire, then return to top.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.75;
        for (let y = 0; y <= document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 600));
      });
      await page.waitForTimeout(800);
      // Force a full re-raster before fullPage capture: Chromium can reuse stale
      // compositor tiles for oversized surfaces (content from the top of the page
      // smears across the bottom). Hiding/restoring <body> discards every tile.
      await page.evaluate(async () => {
        document.body.style.display = 'none';
        void document.body.offsetHeight;
        document.body.style.display = '';
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      });
      await page.waitForTimeout(400);
      const dir = path.join(outdir, target.label, vp.name);
      await mkdir(dir, { recursive: true });
      // Stitched full-page capture (avoids Chromium fullPage artifacts with
      // vh-sized sections / fixed headers): scroll in viewport-height tiles.
      const tiles = await page.evaluate(async () => {
        const vh = window.innerHeight;
        const total = document.documentElement.scrollHeight;
        const out = [];
        for (let y = 0; y < total; y += vh) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 350));
          out.push(Math.min(y, total - vh));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
        return { stops: [...new Set(out)], vh };
      });
      let idx = 0;
      for (const y of tiles.stops) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(dir, `${pg.name}-tile${String(idx).padStart(2, '0')}.png`) });
        idx++;
      }
      await page.screenshot({ path: path.join(dir, `${pg.name}-fold.png`) });
      console.log(`captured ${target.label}/${vp.name}/${pg.name} (${idx} tiles)`);
    }
    await context.close();
  }
}

await browser.close();
await writeFile(
  path.join(outdir, 'manifest-used.json'),
  JSON.stringify(manifest, null, 2)
);
console.log('done');
