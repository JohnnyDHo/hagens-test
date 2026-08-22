#!/usr/bin/env node
// Rewrites asset/img/<name>.jpg references to asset/img/opt/<name>.webp
// across site pages + CSS, and syncs <img> width/height to the WebP's real
// intrinsic dimensions.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'site');

// name -> [width, height] of the optimized copies.
const DIMS = {
  'hero-poster': [1600, 900],
  'join-us-rider': [1366, 1366],
  'team-photo': [1170, 873],
  'mason-lake-1': [1600, 1280],
  'mason-lake-2': [1600, 1280],
  'mason-lake-3': [1600, 1068],
  'mason-lake-4': [1100, 880],
  'mason-lake-5': [1100, 880],
  'race-mason-1': [1100, 880],
  'race-mason-2': [1100, 880],
  'race-mason-3': [1100, 735],
  'race-mason-4': [1100, 880],
  'race-mason-5': [1100, 880],
  'rider-join': [1100, 1100],
  'wtnb-start': [1100, 825],
  'wtnb-course': [1600, 1200],
};

const FILES = [
  'index.html', 'join.html', 'partners.html', 'events.html',
  'mason.html', 'wtnb.html', 'gallery.html',
  'assets/css/main.css',
];

for (const f of FILES) {
  const p = path.join(SITE, f);
  let src = await readFile(p, 'utf8');
  const before = src;

  // Path swap: assets/img/<name>.jpg -> assets/img/opt/<name>.webp
  src = src.replace(/assets\/img\/([a-z0-9-]+)\.jpg/g, (m, name) =>
    DIMS[name] ? `assets/img/opt/${name}.webp` : m);

  // Sync intrinsic dimensions on every <img> that points at an optimized file.
  src = src.replace(/<img\b[^>]*>/g, (tag) => {
    const m = tag.match(/assets\/img\/opt\/([a-z0-9-]+)\.webp/);
    if (!m || !DIMS[m[1]]) return tag;
    const [w, h] = DIMS[m[1]];
    let out = tag;
    if (/\swidth="\d+"/.test(out)) out = out.replace(/\swidth="\d+"/, ` width="${w}"`);
    if (/\sheight="\d+"/.test(out)) out = out.replace(/\sheight="\d+"/, ` height="${h}"`);
    return out;
  });

  if (src !== before) {
    await writeFile(p, src);
    const n = (before.match(/assets\/img\/[a-z0-9-]+\.jpg/g) || []).length;
    console.log(`${f}: ${n} jpg ref(s) -> opt/*.webp`);
  } else {
    console.log(`${f}: no changes`);
  }
}
