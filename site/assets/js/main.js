/* Hagens Berman Racing — motion & behavior */
(() => {
  document.documentElement.classList.add("js");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector("[data-menu-toggle]");
  const overlay = document.querySelector("[data-menu-overlay]");
  const label = document.querySelector("[data-menu-label]");
  let lastFocused = null;

  const focusablesIn = (root) =>
    [...root.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")];

  function openMenu() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    /* Focus must land INSIDE the overlay: visibility flips to visible only
       when .is-open lands, so class + forced recalc + focus all happen in
       the same frame — focusing earlier would silently no-op against
       visibility:hidden and strand keyboard users outside the menu. */
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      void overlay.offsetHeight;
      focusablesIn(overlay)[0]?.focus({ preventScroll: true });
    });
    toggle.setAttribute("aria-expanded", "true");
    if (label) label.textContent = "Close";
    document.body.classList.add("menu-open");
    window.__lenis?.stop();
    document.addEventListener("keydown", onMenuKeydown);
    document.addEventListener("focusin", onDocFocusin);
  }

  function closeMenu() {
    overlay.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (label) label.textContent = "Menu";
    document.body.classList.remove("menu-open");
    window.__lenis?.start();
    setTimeout(() => { overlay.hidden = true; }, 400);
    document.removeEventListener("keydown", onMenuKeydown);
    document.removeEventListener("focusin", onDocFocusin);
    (lastFocused || toggle).focus({ preventScroll: true });
  }

  function onMenuKeydown(e) {
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.key !== "Tab") return;
    const items = focusablesIn(overlay);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function onDocFocusin(e) {
    if (overlay.classList.contains("is-open") && !overlay.contains(e.target) && e.target !== toggle) {
      focusablesIn(overlay)[0]?.focus();
    }
  }

  if (toggle && overlay) {
    toggle.addEventListener("click", () => {
      toggle.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
    });
    overlay.querySelectorAll(".overlay-link").forEach((a) =>
      a.addEventListener("click", () => closeMenu())
    );
  }

  function closeMenuIfOpen() {
    if (toggle && toggle.getAttribute("aria-expanded") === "true") closeMenu();
  }

  /* ---------- Header state ---------- */
  const header = document.querySelector("[data-header]");
  let ticking = false;
  function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.72);
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });
  updateHeader();

  /* ---------- Stable hero height ----------
     Viewport-unit heights (100svh) re-resolve whenever the rendering
     surface changes size — mobile browser UI, or oversized offscreen
     capture surfaces — and shift the entire document mid-flight.
     Pinning the computed min-height to pixels keeps layout stable.
     Re-locked only on real width changes so URL-bar show/hide doesn't
     thrash it. */
  const hero = document.querySelector(".hero");
  const lockHeroHeight = () => {
    if (!hero) return;
    hero.style.minHeight = "";
    const mh = getComputedStyle(hero).minHeight;
    if (mh && mh !== "0px") hero.style.minHeight = mh;
  };
  lockHeroHeight();
  let lastHeroWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== lastHeroWidth) {
      lastHeroWidth = window.innerWidth;
      lockHeroHeight();
      window.ScrollTrigger?.refresh();
    }
  });

  /* ---------- Hero video autoplay ----------
     iOS Safari can ignore the autoplay attribute unless muted is set
     as a property; nudge playback programmatically once data lands
     and swallow any rejection (e.g. low-power-mode blocks). */
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    heroVideo.muted = true;
    const tryPlay = () => heroVideo.play().catch(() => {});
    if (heroVideo.readyState >= 2) tryPlay();
    else heroVideo.addEventListener("loadeddata", tryPlay, { once: true });
  }

  /* ---------- Motion ---------- */
  if (prefersReduced || !window.gsap) return;

  gsap.registerPlugin(ScrollTrigger);
  window.addEventListener("load", () => ScrollTrigger.refresh());

  /* Smooth scroll — initialized lazily on first real wheel input so that
     programmatic/native scrolling (anchors, robots, screenshot rigs)
     always behaves natively and never fights an active animation. */
  let lenis = null;
  const startLenis = () => {
    if (lenis || prefersReduced || !window.Lenis) return;
    lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    window.__lenis = lenis;
    document.documentElement.classList.add("lenis-active");
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    /* Keep Lenis's cached scroll limit in sync as fonts/images settle,
       otherwise it clamps the page to a stale document height. */
    const resync = () => { lenis.resize(); ScrollTrigger.refresh(); };
    window.addEventListener("load", resync);
    document.fonts?.ready.then(resync);
    setTimeout(resync, 1200);
  };
  if (!isTouch) window.addEventListener("wheel", startLenis, { once: true, passive: true });

  /* In-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenuIfOpen();
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      if (lenis) lenis.scrollTo(target, { offset: -(header?.offsetHeight || 56) });
      else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      target.focus({ preventScroll: true });
    });
  });

  /* Hero intro timeline */
  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from("[data-hero-line]", { yPercent: 112, duration: 1.1, stagger: 0.12, delay: 0.15 })
    .from(".hero-kicker", { opacity: 0, x: -18, duration: 0.6 }, "-=0.9")
    .from(".hero-lede", { opacity: 0, y: 22, duration: 0.7 }, "-=0.55")
    .from(".hero-actions .btn", { opacity: 0, y: 16, duration: 0.55, stagger: 0.08 }, "-=0.45")
    .from(".hero-meta > *", { opacity: 0, y: 14, duration: 0.55, stagger: 0.08 }, "-=0.35")
    .from(".site-header", { opacity: 0, y: -10, duration: 0.5 }, "-=0.6");

  /* Generic reveals */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 34,
      duration: 0.85,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 86%", once: true },
    });
  });

  /* Mason Lake start sheet — rows cascade in once, grouped as they enter. */
  const catRows = document.querySelectorAll(".cats tbody tr");
  if (catRows.length) {
    gsap.set(catRows, { opacity: 0, y: 24 });
    ScrollTrigger.batch(catRows, {
      start: "top 88%",
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          stagger: 0.07,
          overwrite: true,
        }),
    });
  }

  /* Image clip reveals */
  gsap.utils.toArray("[data-reveal-img]").forEach((el) => {
    const img = el.querySelector("img");
    gsap
      .timeline({
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
        defaults: { ease: "power3.out" },
      })
      .from(el, { clipPath: "inset(12% 6% 12% 6%)", opacity: 0.4, duration: 0.9 })
      /* clearProps: CSS transitions on img transforms can capture the tween's
         initial scale as a stale inline value, leaving photos painted ~18%
         large over content below. Clearing at the end hands control back to
         the stylesheet (:hover zoom) with no residue. */
      .from(img, { scale: 1.18, duration: 1.15, clearProps: "scale,transform" }, "<");
  });

  /* Section rule grows */
  gsap.utils.toArray(".section-rule").forEach((el) => {
    gsap.from(el, {
      scaleX: 0,
      duration: 0.9,
      ease: "power3.inOut",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  /* Parallax on the big team photo — scale lives inside the same
     transform as the parallax so the image owns a single layer. */
  gsap.utils.toArray("[data-parallax-figure] img").forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -7, scale: 1.16 },
      {
        yPercent: 7,
        scale: 1.16,
        ease: "none",
        transformOrigin: "center bottom",
        scrollTrigger: {
          trigger: img.closest("[data-parallax-figure]") || img,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
})();
