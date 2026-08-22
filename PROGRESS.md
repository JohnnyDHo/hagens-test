# Hagens Berman Racing — Rebuild Progress

Goal: Awwwards-caliber local site for Hagens Berman Racing Seattle (`#14539e`), beating https://hb-redesign-five.vercel.app/ in blind A/B on desktop (1440×900) and mobile (390×844). No deployment.

**Quality bar:** editorial, distinctive, fast, accessible; cinematic video hero; GSAP motion; mobile as intentional as desktop; feels designed by a great human studio.

**Method:** each piece → builder subagent → fresh-context critic inspects real rendered screenshots (blind-labeled A/B vs competitor when possible) → loop until ours clearly wins → commit checkpoint.

| # | Piece | Status | Latest verdict |
|---|-------|--------|----------------|
| 1 | Foundation + Home (video hero, nav, story, footer) | ✅ critic-passed | R1 blind A/B: ours 84 vs competitor 41 desktop, 84 vs 54 mobile — clear win |
| 2 | Join Us page | 🔄 in progress | — |
| 3 | Partners page | ⏳ pending | — |
| 4 | Events pages (Mason Lake, WTNB Night at PR) | ⏳ pending | — |
| 5 | Gallery page | ⏳ pending | — |
| 6 | Site-wide motion polish | ⏳ pending | — |
| 7 | Mobile deep-pass | ⏳ pending | — |
| 8 | Accessibility & performance hardening | ⏳ pending | — |
| F | Final full-site blind A/B (desktop + mobile) | ⏳ pending | — |

## Log
- 2026-08-21: Content scraped from hbsccycling.com into `CONTENT.md`; competitor surveyed (static 5-page site, placeholder imagery); A/B screenshot rig verified in `tools/`. Piece 1 builder launched.
- 2026-08-21: Piece 1 built + polished (commit 527611b). Critic R1 (blind A/B, downscaled evidence): desktop 84–41, mobile 84–54 in our favor. Action item: strengthen mobile hero kicker contrast over video.
