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

const selectAll = <T extends Element>(root: Element, selector: string) =>
  Array.from(root.querySelectorAll<T>(selector));

export default function HomeMotion() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-motion-root]");
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const runningAnimations = new Set<gsap.core.Animation>();
    const media = gsap.matchMedia();
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

          const remember = <T extends gsap.core.Animation>(animation: T) => {
            runningAnimations.add(animation);
            return animation;
          };

          const progressFill = root.querySelector<HTMLElement>(
            "[data-motion-progress-fill]",
          );

          if (progressFill) {
            remember(
              gsap.to(progressFill, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  start: 0,
                  end: "max",
                  scrub: desktop ? 0.3 : 0.12,
                  invalidateOnRefresh: true,
                },
              }),
            );
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
                { scaleY: 0.12, transformOrigin: "50% 0%" },
                {
                  scaleY: 1,
                  duration: 0.86,
                  ease: "power4.out",
                  clearProps: "transform,transformOrigin",
                },
                0.08,
              );
            }

            if (kicker) {
              heroTimeline.fromTo(
                kicker,
                { y: mobile ? 12 : 18, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.68,
                  ease: "power2.out",
                  clearProps: "transform,opacity",
                },
                0.18,
              );
            }

            if (lines.length) {
              heroTimeline.fromTo(
                lines,
                {
                  yPercent: desktop ? 32 : 20,
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0)",
                },
                {
                  yPercent: 0,
                  opacity: 1,
                  clipPath: "inset(0 0 0% 0)",
                  duration: desktop ? 1.02 : 0.76,
                  stagger: desktop ? 0.13 : 0.09,
                  ease: "power4.out",
                  clearProps: "transform,opacity,clipPath",
                },
                0.25,
              );
            }

            if (meta.length) {
              heroTimeline.fromTo(
                meta,
                { y: mobile ? 12 : 20, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: desktop ? 0.76 : 0.58,
                  stagger: desktop ? 0.08 : 0.045,
                  ease: "power3.out",
                  clearProps: "transform,opacity",
                },
                desktop ? 0.72 : 0.58,
              );
            }
          }

          selectAll<HTMLElement>(root, "[data-motion-masthead]").forEach(
            (masthead) => {
              const items = Array.from(masthead.children).filter(
                (item): item is HTMLElement => item instanceof HTMLElement,
              );
              if (!items.length) return;

              remember(
                gsap.fromTo(
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
                ),
              );
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-stagger]").forEach(
            (group) => {
              const items = Array.from(group.children).filter(
                (item): item is HTMLElement => item instanceof HTMLElement,
              );
              if (!items.length) return;

              remember(
                gsap.fromTo(
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
                ),
              );
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-atlas]").forEach(
            (atlas) => {
              const items = Array.from(atlas.children).filter(
                (item): item is HTMLElement => item instanceof HTMLElement,
              );

              items.forEach((item, index) => {
                remember(
                  gsap.fromTo(
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
                  ),
                );
              });
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-image]").forEach(
            (frame) => {
              const images = selectAll<HTMLElement>(frame, "img");
              const imageTimeline = remember(
                gsap.timeline({
                  scrollTrigger: {
                    trigger: frame,
                    start: desktop ? "top 82%" : "top 91%",
                    once: true,
                  },
                }),
              );

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
            },
          );

          selectAll<HTMLElement>(root, "[data-motion-accent]").forEach(
            (accent) => {
              remember(
                gsap.fromTo(
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
                ),
              );
            },
          );

          return () => {
            runningAnimations.clear();
          };
        },
      );
    }, root);

    const syncVisibility = () => {
      runningAnimations.forEach((animation) => {
        if (animation.scrollTrigger?.scrub) return;
        animation.paused(document.visibilityState === "hidden");
      });
    };

    document.addEventListener("visibilitychange", syncVisibility);
    syncVisibility();
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      media.revert();
      context.revert();
      runningAnimations.clear();
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
