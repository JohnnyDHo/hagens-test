# Task: Accessibility + Performance Hardening

Site: /Users/johnnyho/source-code/hagens-test/site/ (served http://localhost:4173). Static pages: index, join, partners, events, mason, wtnb, gallery (.html). Playwright is installed in /Users/johnnyho/source-code/hagens-test/tools/.

## Accessibility
1. `cd tools && npm i axe-core --no-fund --no-audit`, then write a small playwright script that loads every page at 1440x900 and 390x844, injects axe-core from node_modules, logs violations with selectors.
2. Fix all serious/critical violations (contrast, aria attributes, form/button labels, landmark structure). Re-run until clean or only minor/benign items remain (document any you leave).
3. Keyboard pass via a headless script: skip link works and is first tab stop; mobile menu overlay traps focus and closes on Escape; every interactive element has visible focus style; no focus traps outside the menu.

## Performance
4. Images: several JPEGs are 500KB-1MB at 2048w. Use sips or ffmpeg to create optimized WebP copies in site/assets/img/opt/ (grid images max ~1100w q~75; hero/interlude max ~1600w q~78), update src references across pages, keep originals untouched. Target under ~250KB per grid image.
5. Hero video: confirm preload="metadata" + poster; add preload="none" for any below-fold media.
6. Report total transfer weight per page before/after (sum of local assets referenced) in your reply.

## Verify + commit
7. Quick visual regression check: cd tools && node shoot.mjs manifest for / at 1440x900 + 390x844 into shots/self-a11yperf/ ; READ fold screenshots; confirm nothing visually broke.
8. From repo root: git add -A && git commit -m "feat(site): accessibility and performance hardening"
9. Reply: violations fixed, keyboard results, weight before/after per page, commit hash.

Do NOT deploy anything. Work only inside this repo.
