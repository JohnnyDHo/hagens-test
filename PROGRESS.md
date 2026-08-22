# Hagens Berman Racing — Rebuild Progress

Goal: Awwwards-caliber local site for Hagens Berman Racing Seattle (`#14539e`), beating https://hb-redesign-five.vercel.app/ in blind A/B on desktop (1440×900) and mobile (390×844). No deployment.

**Quality bar:** editorial, distinctive, fast, accessible; cinematic video hero; GSAP motion; mobile as intentional as desktop; feels designed by a great human studio.

**Method:** each piece → builder subagent → fresh-context critic inspects real rendered screenshots (blind-labeled A/B vs competitor when possible) → loop until ours clearly wins → commit checkpoint.

| # | Piece | Status | Latest verdict |
|---|-------|--------|----------------|
| 1 | Foundation + Home (video hero, nav, story, footer) | ✅ critic-passed | R1 blind A/B: ours 84 vs competitor 41 desktop, 84 vs 54 mobile — clear win |
| 2 | Join Us page | ✅ critic-passed | R1 blind A/B vs competitor about: ours 79 vs 36 — clear win; 3 polish notes queued |
| 3 | Partners page | ✅ critic-passed | R1 blind A/B: ours 79 vs 36 — clear win; ledger-depth fixes queued |
| 4 | Events pages (Mason Lake, WTNB Night at PR) | 🔄 in progress | — |
| 5 | Gallery page | ⏳ pending | — |
| 6 | Site-wide motion polish | ⏳ pending | — |
| 7 | Mobile deep-pass | ⏳ pending | — |
| 8 | Accessibility & performance hardening | ⏳ pending | — |
| F | Final full-site blind A/B (desktop + mobile) | ⏳ pending | — |

## Log
- 2026-08-21: Content scraped from hbsccycling.com into `CONTENT.md`; competitor surveyed (static 5-page site, placeholder imagery); A/B screenshot rig verified in `tools/`. Piece 1 builder launched.
- 2026-08-21: Piece 1 built + polished (commit 527611b). Critic R1 (blind A/B, downscaled evidence): desktop 84–41, mobile 84–54 in our favor. Action item: strengthen mobile hero kicker contrast over video.
- 2026-08-21: Kicker contrast fixed + Join Us page built (282034a); repo history cleaned of accidental tool deps (e6320a7). Critic R1 join vs competitor about: 79–36 clear win. Queued: own the join hero treatment, tighten navy dead band, women's-program image asset.
