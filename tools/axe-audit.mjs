#!/usr/bin/env node
// axe-core audit across every page at desktop + mobile viewports.
// Usage: node axe-audit.mjs [--label baseline|after]

import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const axeSrc = await readFile(path.join(__dirname, 'node_modules/axe-core/axe.min.js'), 'utf8');

const args = process.argv.slice(2);
const labelIdx = args.indexOf('--label');
const label = labelIdx >= 0 ? args[labelIdx + 1] : 'run';

const BASE = 'http://localhost:4173';
const PAGES = ['/', '/join.html', '/partners.html', '/events.html', '/mason.html', '/wtnb.html', '/gallery.html'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch({ channel: 'chromium' });
const report = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
    // Let reveal animations settle so nothing is mid-transition when axe snapshots.
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 700));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.evaluate(axeSrc);
    const results = await page.evaluate(() =>
      window.axe.run(document, {
        resultTypes: ['violations'],
      })
    );
    for (const v of results.violations) {
      report.push({
        viewport: vp.name,
        page: p,
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => n.target.join(' ')),
      });
    }
    console.log(`audited ${vp.name} ${p}: ${results.violations.length} violations`);
  }
  await context.close();
}
await browser.close();

await mkdir(path.join(__dirname, 'a11y'), { recursive: true });
const out = path.join(__dirname, 'a11y', `axe-${label}.json`);
await writeFile(out, JSON.stringify(report, null, 2));

// Console summary grouped by impact.
const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const seen = new Map();
for (const r of report) {
  const key = `${r.id}|${r.impact}`;
  if (!seen.has(key)) seen.set(key, { id: r.id, impact: r.impact, help: r.help, pages: new Set(), sel: new Set() });
  const e = seen.get(key);
  e.pages.add(`${r.page}(${r.viewport})`);
  r.nodes.forEach((s) => e.sel.add(s));
}
console.log('\n=== VIOLATIONS ===');
for (const e of [...seen.values()].sort((a, b) => (order[a.impact] ?? 9) - (order[b.impact] ?? 9))) {
  console.log(`\n[${e.impact ?? '?'}] ${e.id} — ${e.help}`);
  console.log(`  pages: ${[...e.pages].join(', ')}`);
  [...e.sel].slice(0, 12).forEach((s) => console.log(`  - ${s}`));
  if (e.sel.size > 12) console.log(`  … +${e.sel.size - 12} more selectors`);
}
console.log(`\nfull report: ${out}`);
