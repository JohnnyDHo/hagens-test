#!/usr/bin/env node
// Per-page transfer weight: sums every local asset referenced by each page
// (HTML -> src/href/poster, CSS -> url()/@import, recursively).
// Usage: node weight-report.mjs [--label baseline|after]

import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.join(__dirname, '..', 'site');
const args = process.argv.slice(2);
const labelIdx = args.indexOf('--label');
const label = labelIdx >= 0 ? args[labelIdx + 1] : 'run';

const PAGES = ['index.html', 'join.html', 'partners.html', 'events.html', 'mason.html', 'wtnb.html', 'gallery.html'];
const kb = (n) => (n / 1024).toFixed(n / 1024 >= 100 ? 0 : 1);

async function sizeOf(rel) {
  const p = path.join(SITE, rel);
  try {
    return (await stat(p)).size;
  } catch {
    return null;
  }
}

function localRefsFromHtml(html) {
  const refs = new Set();
  const attrRe = /(?:src|href|poster)\s*=\s*"([^"]+)"/gi;
  let m;
  while ((m = attrRe.exec(html))) {
    const v = m[1];
    if (/^(https?:|\/\/|#|mailto:|data:)/i.test(v)) continue;
    refs.add(v.split('#')[0].split('?')[0]);
  }
  return refs;
}

function localRefsFromCss(css, cssDir) {
  const refs = new Set();
  const urlRe = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
  const importRe = /@import\s+(?:url\()?['"]([^'"]+)['"]/gi;
  let m;
  while ((m = urlRe.exec(css))) {
    if (/^(https?:|\/\/|data:)/i.test(m[1])) continue;
    refs.add(path.posix.normalize(path.posix.join(cssDir, m[1])));
  }
  while ((m = importRe.exec(css))) {
    if (/^(https?:|\/\/)/i.test(m[1])) continue;
    refs.add(path.posix.normalize(path.posix.join(cssDir, m[1])));
  }
  return refs;
}

const rows = [];
for (const pg of PAGES) {
  const assets = new Map(); // ref -> bytes
  const queue = [...localRefsFromHtml(await readFile(path.join(SITE, pg), 'utf8'))];
  const seenCss = new Set();
  while (queue.length) {
    const ref = queue.shift();
    if (!ref || assets.has(ref)) continue;
    const bytes = await sizeOf(ref);
    assets.set(ref, bytes);
    if (bytes != null && ref.endsWith('.css') && !seenCss.has(ref)) {
      seenCss.add(ref);
      for (const c of localRefsFromCss(await readFile(path.join(SITE, ref), 'utf8'), path.posix.dirname(ref))) {
        queue.push(c);
      }
    }
  }
  let total = 0, missing = [];
  for (const [, b] of assets) b == null ? missing.push(1) : (total += b);
  rows.push({ page: pg, total, count: assets.size, missing: missing.length, detail: assets });
}

let grandBefore = 0;
console.log(`\n== Transfer weight (${label}) — sum of referenced local assets ==`);
for (const r of rows) {
  grandBefore += r.total;
  console.log(`${r.page.padEnd(15)} ${kb(r.total).padStart(7)} KB  (${r.count} refs${r.missing ? `, ${r.missing} MISSING` : ''})`);
}
console.log(`${'TOTAL'.padEnd(15)} ${kb(grandBefore).padStart(7)} KB`);

// Image-only subtotal per page (what the optimization targets).
console.log(`\n-- image subtotal per page --`);
for (const r of rows) {
  let img = 0;
  for (const [ref, b] of r.detail) {
    if (/\.(jpe?g|png|webp|gif)$/i.test(ref) && b != null) img += b;
  }
  console.log(`${r.page.padEnd(15)} ${kb(img).padStart(7)} KB`);
}
await writeFileSafe(JSON.stringify(rows, null, 2));

async function writeFileSafe(data) {
  const { writeFile, mkdir } = await import('node:fs/promises');
  await mkdir(path.join(__dirname, 'a11y'), { recursive: true });
  await writeFile(path.join(__dirname, 'a11y', `weight-${label}.json`), data);
}
