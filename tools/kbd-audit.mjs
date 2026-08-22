#!/usr/bin/env node
// Headless keyboard pass:
//   1. skip link is the first tab stop, visibly revealed, and jumps to #main
//   2. every interactive element shows a visible :focus-visible style
//   3. mobile menu overlay traps focus and closes on Escape
//   4. no focus traps outside the menu (full tab walk reaches every focusable)

import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';
const PAGES = ['/', '/join.html', '/partners.html', '/events.html', '/mason.html', '/wtnb.html', '/gallery.html'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ channel: 'chromium' });
const failures = [];
const notes = [];
const fail = (msg) => failures.push(msg);

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(600);

    /* ---- 1. skip link ---- */
    await page.keyboard.press('Tab');
    const skip = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      return {
        ok: el.classList.contains('skip-link'),
        top: el.getBoundingClientRect().top,
        outline: `${cs.outlineWidth} ${cs.outlineStyle}`,
      };
    });
    if (!skip.ok) fail(`[${vp.name} ${p}] first Tab stop is not the skip link (${await page.evaluate(() => document.activeElement.outerHTML.slice(0, 80))})`);
    else if (skip.top < 0) fail(`[${vp.name} ${p}] skip link focused but still off-screen (top=${skip.top})`);
    if (skip.ok) {
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      const jumped = await page.evaluate(() => {
        const el = document.activeElement;
        return { id: el.id, inMain: !!el.closest('#main'), hash: location.hash };
      });
      if (!jumped.inMain) fail(`[${vp.name} ${p}] skip link activation did not move focus into #main (active=${jumped.id || 'body'}, hash=${jumped.hash})`);
    }

    /* ---- 2+4. full tab walk: visible focus styles + no traps ---- */

    // Real keyboard walk from the top of the document.
    await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(500);
    const expectedCount = await page.evaluate(() => {
      const sel = "a[href], button:not([disabled]), summary, [tabindex]:not([tabindex='-1'])";
      const visible = (el) => {
        if (el.closest('[hidden]')) return false;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
      };
      window.__expectedFocusables = [...document.querySelectorAll(sel)].filter(visible);
      window.__expectedFocusables.forEach((el, i) => el.dataset.kbIdx = String(i));
      return window.__expectedFocusables.length;
    });

    const stops = [];
    let noStyle = [];
    const maxStops = expectedCount * 2 + 4;
    for (let i = 0; i < maxStops; i++) {
      await page.keyboard.press('Tab');
      const cur = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return { body: true };
        const cs = getComputedStyle(el);
        const ow = parseFloat(cs.outlineWidth);
        const styled = cs.outlineStyle !== 'none' && ow > 0 &&
          !(cs.outlineColor === 'transparent' || /^rgba\(.+, ?0\)$/.test(cs.outlineColor));
        return {
          body: false,
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 40),
          styled,
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          idx: el.dataset.kbIdx != null ? Number(el.dataset.kbIdx) : -1,
        };
      });
      if (cur.body) { notes.push(`[${vp.name} ${p}] tab walk left the document after ${stops.length} stops`); break; }
      stops.push(cur.idx);
      if (!cur.styled) noStyle.push(`${cur.tag}.${cur.cls} [${cur.outline}]`);
      // Stop once we've wrapped: seeing the first stop again after full coverage.
      if (stops.length > expectedCount && cur.idx === stops[0]) {
        if (new Set(stops.slice(0, -1)).size >= expectedCount) break;
      }
      if (i === maxStops - 1) {
        fail(`[${vp.name} ${p}] tab walk did not cycle through all ${expectedCount} focusables (visited ${stops.length}, unique ${new Set(stops).size})`);
      }
    }
    const uniq = new Set(stops.filter((n) => n >= 0));
    if (uniq.size < expectedCount) {
      const missing = await page.evaluate((seenIdx) =>
        window.__expectedFocusables
          .map((el, i) => ({ el, i }))
          .filter(({ i }) => !seenIdx.includes(i))
          .map(({ el }) => el.outerHTML.slice(0, 60))
      , [...uniq]);
      fail(`[${vp.name} ${p}] ${expectedCount - uniq.size} interactive element(s) unreachable by Tab: ${missing.slice(0, 3).join(' | ')}`);
    }
    if (noStyle.length) fail(`[${vp.name} ${p}] focus style missing on: ${noStyle.slice(0, 5).join('; ')}`);

    /* ---- 3. mobile menu trap + Escape ---- */
    const toggleVisible = await page.evaluate(() => {
      const t = document.querySelector('[data-menu-toggle]');
      return t && getComputedStyle(t).display !== 'none';
    });
    if (toggleVisible) {
      await page.evaluate(() => document.querySelector('[data-menu-toggle]').focus());
      await page.keyboard.press('Enter'); // activate toggle
      await page.waitForTimeout(650);
      const opened = await page.evaluate(() => ({
        expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
        hidden: document.querySelector('[data-menu-overlay]').hidden,
        visible: getComputedStyle(document.querySelector('[data-menu-overlay]')).visibility,
        activeInOverlay: document.querySelector('[data-menu-overlay]').contains(document.activeElement),
      }));
      if (opened.expanded !== 'true' || opened.hidden || opened.visible !== 'visible')
        fail(`[${vp.name} ${p}] menu did not open (expanded=${opened.expanded}, hidden=${opened.hidden}, visibility=${opened.visible})`);
      else {
        if (!opened.activeInOverlay) fail(`[${vp.name} ${p}] focus was not moved into the open menu overlay`);

        const overlayLinks = await page.evaluate(() =>
          [...document.querySelectorAll('[data-menu-overlay] a')].length
        );
        // Walk to the last overlay link, then verify wrap-around both directions.
        for (let i = 0; i < overlayLinks + 2; i++) await page.keyboard.press('Tab');
        const atWrap = await page.evaluate(() =>
          document.querySelector('[data-menu-overlay]').contains(document.activeElement)
        );
        if (!atWrap) fail(`[${vp.name} ${p}] Tab past last overlay link escaped the menu (trap broken)`);
        await page.keyboard.press('Shift+Tab');
        const backIn = await page.evaluate(() =>
          document.querySelector('[data-menu-overlay]').contains(document.activeElement)
        );
        if (!backIn) fail(`[${vp.name} ${p}] Shift+Tab from first overlay link did not wrap to last`);

        // Try to escape by tabbing backwards a bunch — must stay inside.
        let escaped = false;
        for (let i = 0; i < overlayLinks + 3; i++) {
          await page.keyboard.press('Shift+Tab');
          if (!(await page.evaluate(() =>
            document.querySelector('[data-menu-overlay]').contains(document.activeElement)))
          ) { escaped = true; break; }
        }
        if (escaped) fail(`[${vp.name} ${p}] Shift+Tab escaped the open menu overlay`);

        await page.keyboard.press('Escape');
        await page.waitForTimeout(650);
        const closed = await page.evaluate(() => ({
          expanded: document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded'),
          hidden: document.querySelector('[data-menu-overlay]').hidden,
          onToggle: document.activeElement === document.querySelector('[data-menu-toggle]'),
        }));
        if (closed.expanded !== 'false' || !closed.hidden)
          fail(`[${vp.name} ${p}] Escape did not close the menu (expanded=${closed.expanded}, hidden=${closed.hidden})`);
        if (!closed.onToggle)
          fail(`[${vp.name} ${p}] focus did not return to the menu toggle after Escape`);
      }
    } else {
      notes.push(`[${vp.name} ${p}] menu toggle not visible — overlay test skipped (desktop nav shown)`);
    }

    console.log(`kbd-checked ${vp.name} ${p}`);
  }
  await ctx.close();
}
await browser.close();

console.log('\n=== KEYBOARD PASS RESULTS ===');
if (notes.length) notes.forEach((n) => console.log('note:', n));
if (failures.length) {
  console.log(`${failures.length} FAILURE(S):`);
  failures.forEach((f) => console.log(' ✗ ' + f));
  process.exit(1);
} else {
  console.log('all checks passed');
}
