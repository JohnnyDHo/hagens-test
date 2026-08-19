"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./HomeMotion.module.css";

type RevealRecord = {
  animation: gsap.core.Animation;
  documentTop: number;
  finalize: () => void;
};

type GsapOwnedElement = HTMLElement & {
  _gsap?: { uncache?: number };
};

const TRANSFORM_CLEAR_PROPS = "transform,translate,rotate,scale";
const TRANSFORM_ORIGIN_CLEAR_PROPS = `${TRANSFORM_CLEAR_PROPS},transformOrigin`;
const TRANSFORM_OPACITY_CLEAR_PROPS = `${TRANSFORM_CLEAR_PROPS},opacity`;
const TRANSFORM_OPACITY_CLIP_CLEAR_PROPS = `${TRANSFORM_CLEAR_PROPS},opacity,clipPath`;
const MANAGED_AUTO_REFRESH_EVENTS = "visibilitychange,DOMContentLoaded,load";
const DEFAULT_AUTO_REFRESH_EVENTS = `${MANAGED_AUTO_REFRESH_EVENTS},resize`;

const RAW_MOTION_PROPERTIES = [
  "transform",
  "translate",
  "rotate",
  "scale",
  "opacity",
  "clip-path",
  "transform-origin",
] as const;

const removeMotionInlineProperties = (
  targets: HTMLElement | Iterable<HTMLElement>,
) => {
  const targetList =
    targets instanceof HTMLElement ? [targets] : Array.from(targets);

  targetList.forEach((target) => {
    RAW_MOTION_PROPERTIES.forEach((property) => {
      target.style.removeProperty(property);
    });

    Array.from(target.style).forEach((property) => {
      if (property.startsWith("--gsap")) {
        target.style.removeProperty(property);
      }
    });

    const gsapTarget = target as GsapOwnedElement;
    if (gsapTarget._gsap) gsapTarget._gsap.uncache = 1;
    if (target.style.length === 0) target.removeAttribute("style");
  });
};

const selectAll = <T extends Element>(root: Element, selector: string) =>
  Array.from(root.querySelectorAll<T>(selector));

const childElements = (element: Element) =>
  Array.from(element.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );

export default function HomeMotion() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-motion-root]");
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ autoRefreshEvents: MANAGED_AUTO_REFRESH_EVENTS });

    let disposed = false;
    let refreshFrame: number | null = null;
    let pendingReconcile: (() => boolean) | null = null;
    let syncProgress: (() => void) | null = null;
    let teardownMotionSession: (() => void) | null = null;
    const runningAnimations = new Set<gsap.core.Animation>();
    const desktopAtMount = window.matchMedia("(min-width: 1024px)").matches;
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const cancelRefresh = () => {
      if (refreshFrame === null) return;
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = null;
    };

    const scheduleRefresh = (reconcile?: () => boolean) => {
      if (reconcile) pendingReconcile = reconcile;
      cancelRefresh();
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = null;
        if (
          disposed ||
          reducedMotionQuery.matches ||
          document.visibilityState === "hidden"
        ) {
          return;
        }

        const reconcileBeforeRefresh = pendingReconcile;
        pendingReconcile = null;
        if (reconcileBeforeRefresh && !reconcileBeforeRefresh()) {
          syncProgress?.();
          return;
        }

        ScrollTrigger.refresh();
        syncProgress?.();
      });
    };

    const setupMotionSession = () => {
      if (disposed || reducedMotionQuery.matches || teardownMotionSession) {
        return;
      }

      const desktop = desktopAtMount;
      const mobile = !desktop;
      const localAnimations = new Set<gsap.core.Animation>();
      const revealRecords: RevealRecord[] = [];
      const localMotionTargets = new Set<HTMLElement>();
      let cleanupProgress: (() => void) | null = null;

      const context = gsap.context(() => {
          const remember = <T extends gsap.core.Animation>(animation: T) => {
            localAnimations.add(animation);
            runningAnimations.add(animation);
            return animation;
          };

          const getProjectedScrollY = () => {
            let projectedScrollY = window.scrollY;
            const hash = window.location.hash.slice(1);
            let hashTarget: HTMLElement | null = null;

            if (hash) {
              try {
                hashTarget = document.getElementById(decodeURIComponent(hash));
              } catch {
                hashTarget = document.getElementById(hash);
              }
            }

            if (hashTarget) {
              const stickyHeader = document.querySelector<HTMLElement>(
                "[data-site-header]",
              );
              const stickyOffset =
                (stickyHeader?.getBoundingClientRect().height ?? 0) + 16;
              const hashTop =
                window.scrollY + hashTarget.getBoundingClientRect().top;
              projectedScrollY = Math.max(
                projectedScrollY,
                Math.max(0, hashTop - stickyOffset),
              );
            }

            return projectedScrollY;
          };

          const getDocumentTop = (element: HTMLElement) =>
            window.scrollY + element.getBoundingClientRect().top;

          const isUpcoming = (documentTop: number) => {
            if (!Number.isFinite(documentTop)) return false;
            const projectedTop = documentTop - getProjectedScrollY();
            const viewportHeight = Math.max(
              window.innerHeight,
              document.documentElement.clientHeight,
            );

            return projectedTop > viewportHeight + 1;
          };

          const finalize = (
            targets: HTMLElement | HTMLElement[],
            properties: string,
          ) => {
            gsap.set(targets, { clearProps: properties });
            removeMotionInlineProperties(targets);
          };

          const ownMotion = (targets: HTMLElement | HTMLElement[]) => {
            const targetList = Array.isArray(targets) ? targets : [targets];
            targetList.forEach((target) => {
              localMotionTargets.add(target);
            });
          };

          const registerReveal = (
            animation: gsap.core.Animation,
            documentTop: number,
            finalizeReveal: () => void,
          ) => {
            remember(animation);
            revealRecords.push({
              animation,
              documentTop,
              finalize: finalizeReveal,
            });
          };

          const progressFill = root.querySelector<HTMLElement>(
            "[data-motion-progress-fill]",
          );

          if (progressFill) {
            ownMotion(progressFill);
            const updateProgress = () => {
              if (document.visibilityState === "hidden") return;
              const scrollRange = Math.max(
                1,
                document.documentElement.scrollHeight - window.innerHeight,
              );
              const progress = Math.min(
                1,
                Math.max(0, window.scrollY / scrollRange),
              );
              progressFill.style.transform = `scaleY(${progress})`;
            };

            syncProgress = updateProgress;
            window.addEventListener("scroll", updateProgress, { passive: true });
            updateProgress();

            cleanupProgress = () => {
              window.removeEventListener("scroll", updateProgress);
              if (syncProgress === updateProgress) syncProgress = null;
              removeMotionInlineProperties(progressFill);
            };
          }

          const hero = root.querySelector<HTMLElement>("[data-motion-hero]");
          const pageStartsAtHero =
            window.scrollY < 24 &&
            (window.location.hash === "" || window.location.hash === "#top");

          if (hero && pageStartsAtHero) {
            const heroMedia = hero.querySelector<HTMLElement>(
              "[data-motion-hero-media]",
            );
            const stripe = hero.querySelector<HTMLElement>(
              "[data-motion-hero-stripe]",
            );
            const kicker = hero.querySelector<HTMLElement>(
              "[data-motion-hero-kicker]",
            );
            const lines = selectAll<HTMLElement>(hero, "[data-motion-hero-line]");
            const meta = selectAll<HTMLElement>(hero, "[data-motion-hero-meta]");
            const heroMotionTargets: HTMLElement[] = [];
            const heroTimeline = remember(
              gsap.timeline({
                defaults: { overwrite: "auto" },
                onComplete: () =>
                  removeMotionInlineProperties(heroMotionTargets),
              }),
            );

            if (heroMedia) {
              ownMotion(heroMedia);
              heroMotionTargets.push(heroMedia);
              heroTimeline.fromTo(
                heroMedia,
                { scale: desktop ? 1.07 : 1.035 },
                {
                  scale: 1,
                  duration: desktop ? 1.8 : 1.15,
                  ease: "sine.out",
                  clearProps: TRANSFORM_CLEAR_PROPS,
                },
                0,
              );
            }

            if (stripe) {
              ownMotion(stripe);
              heroMotionTargets.push(stripe);
              heroTimeline.fromTo(
                stripe,
                { scaleY: 0.18, transformOrigin: "50% 0%" },
                {
                  scaleY: 1,
                  duration: 0.86,
                  ease: "power4.out",
                  clearProps: TRANSFORM_ORIGIN_CLEAR_PROPS,
                },
                0.06,
              );
            }

            if (kicker) {
              ownMotion(kicker);
              heroMotionTargets.push(kicker);
              heroTimeline.fromTo(
                kicker,
                { y: mobile ? 6 : 10 },
                {
                  y: 0,
                  duration: 0.62,
                  ease: "power2.out",
                  clearProps: TRANSFORM_CLEAR_PROPS,
                },
                0.14,
              );
            }

            if (lines.length) {
              ownMotion(lines);
              heroMotionTargets.push(...lines);
              heroTimeline.fromTo(
                lines,
                { yPercent: desktop ? 8 : 4 },
                {
                  yPercent: 0,
                  duration: desktop ? 0.96 : 0.7,
                  stagger: desktop ? 0.12 : 0.08,
                  ease: "power4.out",
                  clearProps: TRANSFORM_CLEAR_PROPS,
                },
                0.2,
              );
            }

            if (meta.length) {
              ownMotion(meta);
              heroMotionTargets.push(...meta);
              heroTimeline.fromTo(
                meta,
                { y: mobile ? 6 : 10 },
                {
                  y: 0,
                  duration: desktop ? 0.72 : 0.54,
                  stagger: desktop ? 0.07 : 0.04,
                  ease: "power3.out",
                  clearProps: TRANSFORM_CLEAR_PROPS,
                },
                desktop ? 0.62 : 0.5,
              );
            }
          }

          selectAll<HTMLElement>(root, "[data-motion-masthead]").forEach(
            (masthead) => {
              const items = childElements(masthead);
              if (!items.length) return;
              const documentTop = getDocumentTop(masthead);
              ownMotion(items);

              const finalizeMasthead = () =>
                finalize(items, TRANSFORM_OPACITY_CLIP_CLEAR_PROPS);
              if (!isUpcoming(documentTop)) {
                finalizeMasthead();
                return;
              }

              const animation = gsap.fromTo(
                items,
                {
                  y: desktop ? 48 : 22,
                  opacity: 0,
                  clipPath: desktop
                    ? "inset(0 0 18% 0)"
                    : "inset(0 0 10% 0)",
                },
                {
                  y: 0,
                  opacity: 1,
                  clipPath: "inset(0 0 0% 0)",
                  duration: desktop ? 0.92 : 0.64,
                  stagger: desktop ? 0.11 : 0.06,
                  ease: "power3.out",
                  clearProps: TRANSFORM_OPACITY_CLIP_CLEAR_PROPS,
                  onComplete: finalizeMasthead,
                  scrollTrigger: {
                    trigger: masthead,
                    start: desktop ? "top 76%" : "top 88%",
                    once: true,
                  },
                },
              );

              registerReveal(animation, documentTop, finalizeMasthead);
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-stagger]").forEach(
            (group) => {
              const items = childElements(group);
              if (!items.length) return;
              const documentTop = getDocumentTop(group);
              ownMotion(items);

              const finalizeGroup = () =>
                finalize(items, TRANSFORM_OPACITY_CLEAR_PROPS);
              if (!isUpcoming(documentTop)) {
                finalizeGroup();
                return;
              }

              const animation = gsap.fromTo(
                items,
                { y: desktop ? 34 : 16, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: desktop ? 0.72 : 0.5,
                  stagger: {
                    amount: Math.min(
                      desktop ? 0.38 : 0.22,
                      Math.max(0, (items.length - 1) * 0.07),
                    ),
                    from: "start",
                  },
                  ease: "power2.out",
                  clearProps: TRANSFORM_OPACITY_CLEAR_PROPS,
                  onComplete: finalizeGroup,
                  scrollTrigger: {
                    trigger: group,
                    start: desktop ? "top 82%" : "top 91%",
                    once: true,
                  },
                },
              );

              registerReveal(animation, documentTop, finalizeGroup);
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-atlas]").forEach(
            (atlas) => {
              childElements(atlas).forEach((item, index) => {
                const documentTop = getDocumentTop(item);
                ownMotion(item);
                const finalizeItem = () =>
                  finalize(item, TRANSFORM_OPACITY_CLEAR_PROPS);
                if (!isUpcoming(documentTop)) {
                  finalizeItem();
                  return;
                }

                const animation = gsap.fromTo(
                  item,
                  {
                    x: desktop ? (index % 2 === 0 ? -24 : 24) : 0,
                    y: desktop ? 30 : 18,
                    opacity: 0,
                  },
                  {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: desktop ? 0.82 : 0.56,
                    ease: index === 0 ? "power4.out" : "power3.out",
                    clearProps: TRANSFORM_OPACITY_CLEAR_PROPS,
                    onComplete: finalizeItem,
                    scrollTrigger: {
                      trigger: item,
                      start: desktop ? "top 84%" : "top 92%",
                      once: true,
                    },
                  },
                );

                registerReveal(animation, documentTop, finalizeItem);
              });
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-image]").forEach(
            (frame) => {
              const images = selectAll<HTMLElement>(frame, "img");
              const documentTop = getDocumentTop(frame);
              ownMotion(frame);
              if (images.length) ownMotion(images);
              const finalizeImage = () => {
                finalize(frame, "clipPath");
                if (images.length) finalize(images, TRANSFORM_CLEAR_PROPS);
              };

              if (!isUpcoming(documentTop)) {
                finalizeImage();
                return;
              }

              const imageTimeline = gsap.timeline({
                onComplete: finalizeImage,
                scrollTrigger: {
                  trigger: frame,
                  start: desktop ? "top 82%" : "top 91%",
                  once: true,
                },
              });

              imageTimeline.fromTo(
                frame,
                {
                  clipPath: desktop
                    ? "inset(0 0 15% 0)"
                    : "inset(0 0 8% 0)",
                },
                {
                  clipPath: "inset(0 0 0% 0)",
                  duration: desktop ? 1.05 : 0.68,
                  ease: "power3.out",
                  clearProps: "clipPath",
                },
                0,
              );

              if (images.length) {
                imageTimeline.fromTo(
                  images,
                  { scale: desktop ? 1.055 : 1.025 },
                  {
                    scale: 1,
                    duration: desktop ? 1.18 : 0.76,
                    ease: "sine.out",
                    clearProps: TRANSFORM_CLEAR_PROPS,
                  },
                  0,
                );
              }

              registerReveal(imageTimeline, documentTop, finalizeImage);
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-accent]").forEach(
            (accent) => {
              const documentTop = getDocumentTop(accent);
              ownMotion(accent);
              const finalizeAccent = () =>
                finalize(accent, TRANSFORM_OPACITY_CLEAR_PROPS);
              if (!isUpcoming(documentTop)) {
                finalizeAccent();
                return;
              }

              const animation = gsap.fromTo(
                accent,
                { x: desktop ? -30 : -14, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  duration: desktop ? 0.82 : 0.58,
                  ease: "power4.out",
                  clearProps: TRANSFORM_OPACITY_CLEAR_PROPS,
                  onComplete: finalizeAccent,
                  scrollTrigger: {
                    trigger: accent,
                    start: desktop ? "top 83%" : "top 92%",
                    once: true,
                  },
                },
              );

              registerReveal(animation, documentTop, finalizeAccent);
            },
          );

          const reconcileBeforeRefresh = () => {
            let hasUpcomingTrigger = false;

            revealRecords.forEach((record) => {
              const scrollTrigger = record.animation.scrollTrigger;
              if (!scrollTrigger || record.animation.progress() >= 1) return;

              if (!isUpcoming(record.documentTop)) {
                scrollTrigger.kill(false);
                record.animation.kill();
                localAnimations.delete(record.animation);
                runningAnimations.delete(record.animation);
                record.finalize();
                return;
              }

              hasUpcomingTrigger = true;
            });

            return hasUpcomingTrigger;
          };

          if (revealRecords.length) {
            scheduleRefresh(reconcileBeforeRefresh);
          }
      }, root);

      const teardownSession = () => {
        if (teardownMotionSession !== teardownSession) return;
        teardownMotionSession = null;
        cancelRefresh();
        pendingReconcile = null;
        cleanupProgress?.();
        cleanupProgress = null;

        context.revert();
        removeMotionInlineProperties(localMotionTargets);
        localMotionTargets.clear();

        localAnimations.forEach((animation) => {
          runningAnimations.delete(animation);
        });
        localAnimations.clear();
      };

      teardownMotionSession = teardownSession;
      if (document.visibilityState === "hidden") {
        localAnimations.forEach((animation) => animation.paused(true));
      }
    };

    const syncVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      runningAnimations.forEach((animation) => animation.paused(hidden));
      if (hidden) {
        cancelRefresh();
        return;
      }

      syncProgress?.();
      if (teardownMotionSession) scheduleRefresh();
    };

    const syncResize = () => {
      if (teardownMotionSession) scheduleRefresh();
    };

    const syncReducedMotion = () => {
      if (reducedMotionQuery.matches) {
        teardownMotionSession?.();
        return;
      }

      setupMotionSession();
    };

    document.addEventListener("visibilitychange", syncVisibility);
    window.addEventListener("resize", syncResize, { passive: true });
    reducedMotionQuery.addEventListener("change", syncReducedMotion);
    syncReducedMotion();
    syncVisibility();

    return () => {
      disposed = true;
      cancelRefresh();
      pendingReconcile = null;
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("resize", syncResize);
      reducedMotionQuery.removeEventListener("change", syncReducedMotion);
      teardownMotionSession?.();
      ScrollTrigger.config({ autoRefreshEvents: DEFAULT_AUTO_REFRESH_EVENTS });
      runningAnimations.clear();
      syncProgress = null;
    };
  }, []);

  return (
    <div className={styles.raceProgress} aria-hidden="true">
      <span className={styles.progressLabel}>Race manual</span>
      <div className={styles.progressTrack}>
        <span className={styles.progressFill} data-motion-progress-fill />
      </div>
      <span className={styles.progressLabel}>00—100</span>
    </div>
  );
}
