"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./HomeMotion.module.css";

type MotionConditions = {
  desktop: boolean;
  mobile: boolean;
  reduceMotion: boolean;
};

type RevealRecord = {
  animation: gsap.core.Animation;
  trigger: HTMLElement;
  finalize: () => void;
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

    let disposed = false;
    let refreshFrame: number | null = null;
    let syncProgress: (() => void) | null = null;
    const runningAnimations = new Set<gsap.core.Animation>();
    const media = gsap.matchMedia();

    const cancelRefresh = () => {
      if (refreshFrame === null) return;
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = null;
    };

    const scheduleRefresh = (reconcile: () => boolean) => {
      cancelRefresh();
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = null;
        if (disposed || !reconcile()) return;
        ScrollTrigger.refresh();
      });
    };

    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (matchContext) => {
          const { desktop, mobile, reduceMotion } =
            matchContext.conditions as MotionConditions;

          if (reduceMotion) return;

          const localAnimations = new Set<gsap.core.Animation>();
          const revealRecords: RevealRecord[] = [];
          let cleanupProgress: (() => void) | null = null;

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

          const isUpcoming = (element: HTMLElement) => {
            const rect = element.getBoundingClientRect();
            if (!Number.isFinite(rect.top)) return false;

            const animatedYOffset =
              Number(gsap.getProperty(element, "y")) || 0;
            const documentTop = window.scrollY + rect.top - animatedYOffset;
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
          };

          const registerReveal = (
            animation: gsap.core.Animation,
            trigger: HTMLElement,
            finalizeReveal: () => void,
          ) => {
            remember(animation);
            revealRecords.push({
              animation,
              trigger,
              finalize: finalizeReveal,
            });
          };

          const progressFill = root.querySelector<HTMLElement>(
            "[data-motion-progress-fill]",
          );

          if (progressFill) {
            const setProgress = gsap.quickSetter(progressFill, "scaleY");
            const updateProgress = () => {
              if (document.visibilityState === "hidden") return;
              const scrollRange = Math.max(
                1,
                document.documentElement.scrollHeight - window.innerHeight,
              );
              setProgress(
                Math.min(1, Math.max(0, window.scrollY / scrollRange)),
              );
            };

            syncProgress = updateProgress;
            window.addEventListener("scroll", updateProgress, { passive: true });
            window.addEventListener("resize", updateProgress, { passive: true });
            updateProgress();

            cleanupProgress = () => {
              window.removeEventListener("scroll", updateProgress);
              window.removeEventListener("resize", updateProgress);
              if (syncProgress === updateProgress) syncProgress = null;
              finalize(progressFill, "transform");
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
            const heroTimeline = remember(
              gsap.timeline({ defaults: { overwrite: "auto" } }),
            );

            if (heroMedia) {
              heroTimeline.fromTo(
                heroMedia,
                { scale: desktop ? 1.07 : 1.035 },
                {
                  scale: 1,
                  duration: desktop ? 1.8 : 1.15,
                  ease: "sine.out",
                  clearProps: "transform",
                },
                0,
              );
            }

            if (stripe) {
              heroTimeline.fromTo(
                stripe,
                { scaleY: 0.18, transformOrigin: "50% 0%" },
                {
                  scaleY: 1,
                  duration: 0.86,
                  ease: "power4.out",
                  clearProps: "transform,transformOrigin",
                },
                0.06,
              );
            }

            if (kicker) {
              heroTimeline.fromTo(
                kicker,
                { y: mobile ? 6 : 10 },
                {
                  y: 0,
                  duration: 0.62,
                  ease: "power2.out",
                  clearProps: "transform",
                },
                0.14,
              );
            }

            if (lines.length) {
              heroTimeline.fromTo(
                lines,
                { yPercent: desktop ? 8 : 4 },
                {
                  yPercent: 0,
                  duration: desktop ? 0.96 : 0.7,
                  stagger: desktop ? 0.12 : 0.08,
                  ease: "power4.out",
                  clearProps: "transform",
                },
                0.2,
              );
            }

            if (meta.length) {
              heroTimeline.fromTo(
                meta,
                { y: mobile ? 6 : 10 },
                {
                  y: 0,
                  duration: desktop ? 0.72 : 0.54,
                  stagger: desktop ? 0.07 : 0.04,
                  ease: "power3.out",
                  clearProps: "transform",
                },
                desktop ? 0.62 : 0.5,
              );
            }
          }

          selectAll<HTMLElement>(root, "[data-motion-masthead]").forEach(
            (masthead) => {
              const items = childElements(masthead);
              if (!items.length) return;

              const finalizeMasthead = () =>
                finalize(items, "transform,opacity,clipPath");
              if (!isUpcoming(masthead)) {
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
                  clearProps: "transform,opacity,clipPath",
                  scrollTrigger: {
                    trigger: masthead,
                    start: desktop ? "top 76%" : "top 88%",
                    once: true,
                  },
                },
              );

              registerReveal(animation, masthead, finalizeMasthead);
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-stagger]").forEach(
            (group) => {
              const items = childElements(group);
              if (!items.length) return;

              const finalizeGroup = () => finalize(items, "transform,opacity");
              if (!isUpcoming(group)) {
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
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: group,
                    start: desktop ? "top 82%" : "top 91%",
                    once: true,
                  },
                },
              );

              registerReveal(animation, group, finalizeGroup);
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-atlas]").forEach(
            (atlas) => {
              childElements(atlas).forEach((item, index) => {
                const finalizeItem = () => finalize(item, "transform,opacity");
                if (!isUpcoming(item)) {
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
                    clearProps: "transform,opacity",
                    scrollTrigger: {
                      trigger: item,
                      start: desktop ? "top 84%" : "top 92%",
                      once: true,
                    },
                  },
                );

                registerReveal(animation, item, finalizeItem);
              });
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-image]").forEach(
            (frame) => {
              const images = selectAll<HTMLElement>(frame, "img");
              const finalizeImage = () => {
                finalize(frame, "clipPath");
                if (images.length) finalize(images, "transform");
              };

              if (!isUpcoming(frame)) {
                finalizeImage();
                return;
              }

              const imageTimeline = gsap.timeline({
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
                    clearProps: "transform",
                  },
                  0,
                );
              }

              registerReveal(imageTimeline, frame, finalizeImage);
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-accent]").forEach(
            (accent) => {
              const finalizeAccent = () =>
                finalize(accent, "transform,opacity");
              if (!isUpcoming(accent)) {
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
                  clearProps: "transform,opacity",
                  scrollTrigger: {
                    trigger: accent,
                    start: desktop ? "top 83%" : "top 92%",
                    once: true,
                  },
                },
              );

              registerReveal(animation, accent, finalizeAccent);
            },
          );

          const reconcileBeforeRefresh = () => {
            let hasUpcomingTrigger = false;

            revealRecords.forEach((record) => {
              const scrollTrigger = record.animation.scrollTrigger;
              if (!scrollTrigger || record.animation.progress() >= 1) return;

              if (!isUpcoming(record.trigger)) {
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

          return () => {
            cancelRefresh();
            cleanupProgress?.();
            cleanupProgress = null;
            localAnimations.forEach((animation) => {
              runningAnimations.delete(animation);
            });
            localAnimations.clear();
          };
        },
      );
    }, root);

    const syncVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      runningAnimations.forEach((animation) => animation.paused(hidden));
      if (!hidden) syncProgress?.();
    };

    document.addEventListener("visibilitychange", syncVisibility);
    syncVisibility();

    return () => {
      disposed = true;
      cancelRefresh();
      document.removeEventListener("visibilitychange", syncVisibility);
      media.revert();
      context.revert();
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
