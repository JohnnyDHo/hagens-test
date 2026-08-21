import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const productionHost = "hbr-production.example";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const workerEnvironment = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const workerContext = {
  waitUntil() {},
  passThroughOnException() {},
};

async function request(pathname, accept = "text/html") {
  return worker.fetch(
    new Request(`https://${productionHost}${pathname}`, {
      headers: {
        accept,
        host: productionHost,
        "x-forwarded-host": productionHost,
        "x-forwarded-proto": "https",
      },
    }),
    workerEnvironment,
    workerContext,
  );
}

async function render(pathname = "/") {
  const response = await request(pathname);
  assert.equal(response.status, 200, `${pathname} should render`);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  return response.text();
}

const count = (value, pattern) => value.match(pattern)?.length ?? 0;

test("server-renders the complete public homepage with truthful structure", async () => {
  const html = await render();

  assert.match(html, /<html lang="en">/);
  assert.match(
    html,
    /<a[^>]+href="#main-content"[^>]*>\s*Skip to content\s*<\/a>/,
  );
  assert.match(html, /<main id="main-content" tabindex="-1">/i);
  assert.equal(count(html, /<h1\b/g), 1);
  assert.match(html, /<h1 id="hero-title">/);
  assert.match(html, /Everyone/);
  assert.match(html, /can race\./);
  assert.match(html, /id="team"/);
  assert.match(html, /id="events"/);
  assert.match(html, /id="join"/);
  assert.match(html, /id="gallery"/);
  assert.match(html, /id="partners"/);
  assert.match(html, /<footer\b/);

  for (const fact of [
    "more than 20 years",
    "Road",
    "Gravel",
    "Cyclocross",
    "Track",
    "Mountain bike",
    "March 21",
    "March 28",
    "August 25, 2026",
    "6:00 PM",
    "6:45 PM",
    "$75",
    "501(c)(3) nonprofit",
    "Hagens Berman",
    "Smith",
    "Skratch Labs",
    "Specialized",
    "SILCA",
  ]) {
    assert.ok(html.includes(fact), `missing verified fact: ${fact}`);
  }
  assert.doesNotMatch(html, /Giordana/i);
  assert.doesNotMatch(html, /winningest|most successful|found(?:ed|ing) in 20\d\d/i);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("emits request-host-safe canonical, Open Graph, X, and schema metadata", async () => {
  const html = await render();
  const absoluteSocialImage = `https://${productionHost}/og.png`;

  assert.match(
    html,
    /<title>Everyone Can Race \| Hagens Berman Racing Seattle<\/title>/,
  );
  assert.match(
    html,
    /<meta name="description" content="Seattle’s amateur cycling team[^>]+>/,
  );
  assert.ok(
    html.includes(`<link rel="canonical" href="https://${productionHost}/"`),
  );
  assert.ok(html.includes(`<meta property="og:url" content="https://${productionHost}/"`));
  assert.ok(html.includes(`<meta property="og:image" content="${absoluteSocialImage}"`));
  assert.ok(html.includes('<meta property="og:image:width" content="1200"'));
  assert.ok(html.includes('<meta property="og:image:height" content="630"'));
  assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image"'));
  assert.ok(html.includes(`<meta name="twitter:image" content="${absoluteSocialImage}"`));
  assert.match(html, /<meta name="theme-color" content="#14539e"/);
  assert.match(html, /<link rel="manifest" href="\/manifest\.webmanifest"/);
  assert.doesNotMatch(html, /localhost[^<"]*\/og\.png/);

  const schemaMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  assert.ok(schemaMatch, "SportsTeam JSON-LD should be present");
  const schema = JSON.parse(schemaMatch[1]);
  assert.equal(schema["@type"], "SportsTeam");
  assert.equal(schema.name, "Hagens Berman Racing Seattle");
  assert.equal(schema.url, `https://${productionHost}/`);
  assert.equal(schema.address.addressLocality, "Seattle");
  assert.equal(schema.nonprofitStatus, "https://schema.org/Nonprofit501c3");
  assert.deepEqual(schema.sport, [
    "Road cycling",
    "Gravel cycling",
    "Cyclocross",
    "Track cycling",
    "Mountain biking",
  ]);
  assert.ok(schema.sameAs.includes("https://www.hbsccycling.com/"));
  assert.equal(schema.foundingDate, undefined);
});

test("preserves accessible media, external links, and dialog semantics", async () => {
  const html = await render();
  const [archiveSource, heroSource] = await Promise.all([
    readFile(new URL("../components/RaceArchive.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/HeroMedia.tsx", import.meta.url), "utf8"),
  ]);
  const targetBlankAnchors = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
  assert.ok(targetBlankAnchors.length >= 15);
  targetBlankAnchors.forEach((anchor) => {
    assert.match(anchor, /rel="noopener noreferrer"/);
    assert.match(anchor, /aria-label="[^"]*opens in a new tab[^"]*"/);
  });

  assert.match(
    html,
    /<video[^>]*muted=""[^>]*loop=""[^>]*playsInline=""[^>]*preload="metadata"[^>]*poster="\/media\/hero-poster\.jpg"/,
  );
  assert.doesNotMatch(html.match(/<video[^>]*>/)?.[0] ?? "", /autoPlay/i);
  assert.match(html, /<source src="\/media\/hero\.mp4" type="video\/mp4"/);
  assert.match(heroSource, /reducedMotion\.matches/);
  assert.match(heroSource, /video\s*\.play\(\)/);
  assert.doesNotMatch(heroSource, /\bautoPlay\b/);
  assert.ok(count(html, /loading="lazy"/g) >= 20);
  assert.match(html, /<dialog[^>]+aria-labelledby="archive-dialog-title"/);
  assert.equal(count(html, /id="archive-dialog-title"/g), 1);
  assert.match(archiveSource, /aria-live="polite" aria-atomic="true"/);
  assert.match(archiveSource, /aria-label="Close race archive viewer"/);
  assert.match(archiveSource, /aria-label="Race archive controls"/);
  assert.match(archiveSource, /dialog\.showModal\(\)/);
  assert.match(archiveSource, /onCancel=/);
  assert.match(archiveSource, /restorePage\(true\)/);
});

test("serves intentional auxiliary routes with private indexing policy", async () => {
  const routeExpectations = [
    ["/progress", "Build Progress", "Every piece earns its place."],
    ["/shell", "Global Shell", "Built for the sharp end of the bunch."],
    ["/system", "Puget Sound Race Manual", "Puget Sound"],
  ];

  for (const [pathname, title, heading] of routeExpectations) {
    const html = await render(pathname);
    assert.ok(
      html.includes(`<title>${title} | Hagens Berman Racing Seattle</title>`),
      `${pathname} should have a route-specific title`,
    );
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
    assert.ok(html.includes(heading));
    assert.match(html, /<main[^>]+id="main-content"[^>]+tabindex="-1"/i);
  }
});

test("serves host-correct discovery metadata", async () => {
  const robotsResponse = await request("/robots.txt", "text/plain");
  const robots = await robotsResponse.text();
  assert.equal(robotsResponse.status, 200);
  assert.match(robots, /User-Agent: \*/);
  assert.doesNotMatch(robots, /Disallow:/);
  assert.ok(robots.includes(`Sitemap: https://${productionHost}/sitemap.xml`));

  const sitemapResponse = await request("/sitemap.xml", "application/xml");
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemapResponse.status, 200);
  assert.ok(sitemap.includes(`<loc>https://${productionHost}/</loc>`));
  assert.equal(count(sitemap, /<url>/g), 1);

  const manifestResponse = await request(
    "/manifest.webmanifest",
    "application/manifest+json",
  );
  const manifest = await manifestResponse.json();
  assert.equal(manifestResponse.status, 200);
  assert.equal(manifest.name, "Hagens Berman Racing Seattle");
  assert.equal(manifest.theme_color, "#14539e");
});

test("keeps social and hero media inside their production contracts", async () => {
  const [og, hero, poster, mediaLedger, packageJson] = await Promise.all([
    readFile(new URL("../public/og.png", import.meta.url)),
    stat(new URL("../public/media/hero.mp4", import.meta.url)),
    stat(new URL("../public/media/hero-poster.jpg", import.meta.url)),
    readFile(new URL("../docs/media-sources.md", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.equal(og.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(og.readUInt32BE(16), 1200);
  assert.equal(og.readUInt32BE(20), 630);
  assert.ok(hero.size <= 1_200_000, "hero video should remain under 1.2 MB");
  assert.ok(poster.size <= 200_000, "hero poster should remain under 200 KB");
  assert.match(mediaLedger, /public\/og\.png/);
  assert.match(mediaLedger, /OpenAI ImageGen/);
  assert.match(mediaLedger, /public\/media\/action-03\.webp/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  const previewFiles = await readdir(
    new URL("../app/_sites-preview", import.meta.url),
  ).catch((error) => {
    if (error?.code === "ENOENT") return [];
    throw error;
  });
  assert.deepEqual(previewFiles, []);
});

test("unit-checks deep-hash math and guards motion ownership statically", async () => {
  const [{ anchorScrollTop, initialHashTargetId }, motion, hashStabilizer] =
    await Promise.all([
      import(new URL("../lib/hash-navigation.ts", import.meta.url)),
      readFile(new URL("../components/HomeMotion.tsx", import.meta.url), "utf8"),
      readFile(
        new URL("../components/InitialHashStabilizer.tsx", import.meta.url),
        "utf8",
      ),
    ]);

  assert.equal(initialHashTargetId("#team"), "team");
  assert.equal(initialHashTargetId("#partners"), "partners");
  assert.equal(initialHashTargetId("#not-a-navigation-target"), null);
  assert.equal(initialHashTargetId("#%E0%A4%A"), null);
  assert.equal(
    anchorScrollTop({
      currentScrollY: 1200,
      targetViewportTop: 420,
      stickyHeaderHeight: 72,
    }),
    1532,
  );

  assert.match(hashStabilizer, /await document\.fonts\.ready/);
  assert.match(hashStabilizer, /requestAnimationFrame/);
  assert.match(hashStabilizer, /wheel|touchstart|pointerdown/);
  assert.doesNotMatch(hashStabilizer, /setTimeout|behavior:\s*"smooth"/);

  assert.match(motion, /new IntersectionObserver/);
  assert.ok(count(motion, /paused:\s*true/g) >= 5);
  assert.match(motion, /reducedMotionQuery\.matches/);
  assert.match(motion, /observer\.disconnect\(\)/);
  assert.match(motion, /removeEventListener\("scroll"/);
  assert.doesNotMatch(motion, /ScrollTrigger/);
});

test("statically guards the owning narrow-mobile typography and ornament rules", async () => {
  const [homeCss, motionCss] = await Promise.all([
    readFile(new URL("../app/home.module.css", import.meta.url), "utf8"),
    readFile(
      new URL("../components/HomeMotion.module.css", import.meta.url),
      "utf8",
    ),
  ]);
  const mobileStart = homeCss.indexOf("@media (max-width: 760px) {");
  const mobileEnd = homeCss.indexOf("@media (max-width: 380px) {", mobileStart);
  const mobileHomeCss = homeCss.slice(mobileStart, mobileEnd);
  const narrowEnd = homeCss.indexOf(
    "@media (prefers-reduced-motion: reduce)",
    mobileEnd,
  );
  const narrowHomeCss = homeCss.slice(mobileEnd, narrowEnd);

  assert.ok(mobileStart >= 0 && mobileEnd > mobileStart);
  assert.match(
    mobileHomeCss,
    /\.topRail\s*\{[^}]*font-size:\s*0\.75rem;/,
  );
  assert.match(
    mobileHomeCss,
    /\.kicker\s*\{[^}]*font-size:\s*0\.75rem;/,
  );
  assert.match(
    motionCss,
    /@media \(max-width: 340px\)\s*\{\s*\.raceProgress\s*\{\s*display:\s*none;/,
  );
  assert.match(
    narrowHomeCss,
    /\.topRail p:last-child\s*\{\s*display:\s*none;/,
  );
});

test("keeps production source free of starter-only assets", async () => {
  const removedAssets = [
    "../public/file.svg",
    "../public/globe.svg",
    "../public/window.svg",
  ];

  for (const relativePath of removedAssets) {
    await assert.rejects(access(new URL(relativePath, import.meta.url)));
  }

  const rootPackage = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  assert.equal(rootPackage.name, "hagens-berman-racing-seattle");
  assert.equal(
    rootPackage.scripts.test,
    "npm run build && node --test tests/rendered-html.test.mjs",
  );
  assert.equal(rootPackage.dependencies["react-loading-skeleton"], undefined);
});
