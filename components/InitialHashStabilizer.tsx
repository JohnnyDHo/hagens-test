"use client";

import { useLayoutEffect } from "react";

const INITIAL_TARGET = "#partners";

export default function InitialHashStabilizer() {
  useLayoutEffect(() => {
    if (window.location.hash !== INITIAL_TARGET) return;

    const target = document.getElementById(INITIAL_TARGET.slice(1));
    if (!target) return;

    let cancelled = false;
    const abort = () => {
      cancelled = true;
    };
    const listenerOptions = { passive: true, once: true } as const;

    window.addEventListener("wheel", abort, listenerOptions);
    window.addEventListener("touchstart", abort, listenerOptions);
    window.addEventListener("pointerdown", abort, listenerOptions);
    window.addEventListener("keydown", abort, { once: true });
    window.addEventListener("hashchange", abort, { once: true });
    window.addEventListener("popstate", abort, { once: true });

    const settleInitialAnchor = async () => {
      await document.fonts.ready;
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => resolve());
      });

      if (cancelled || window.location.hash !== INITIAL_TARGET) return;

      const stickyHeader = document.querySelector<HTMLElement>(
        "[data-site-header]",
      );
      const stickyOffset = (stickyHeader?.getBoundingClientRect().height ?? 0) + 16;
      const targetTop = window.scrollY + target.getBoundingClientRect().top;

      window.scrollTo({
        top: Math.max(0, targetTop - stickyOffset),
        left: window.scrollX,
        behavior: "auto",
      });
    };

    void settleInitialAnchor();

    return () => {
      cancelled = true;
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchstart", abort);
      window.removeEventListener("pointerdown", abort);
      window.removeEventListener("keydown", abort);
      window.removeEventListener("hashchange", abort);
      window.removeEventListener("popstate", abort);
    };
  }, []);

  return null;
}
