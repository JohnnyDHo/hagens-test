"use client";

import { useLayoutEffect } from "react";
import {
  anchorScrollTop,
  initialHashTargetId,
} from "@/lib/hash-navigation";

export default function InitialHashStabilizer() {
  useLayoutEffect(() => {
    const initialHash = window.location.hash;
    const targetId = initialHashTargetId(initialHash);
    if (!targetId) return;

    const target = document.getElementById(targetId);
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

      if (cancelled || window.location.hash !== initialHash) return;

      const stickyHeader = document.querySelector<HTMLElement>(
        "[data-site-header]",
      );
      window.scrollTo({
        top: anchorScrollTop({
          currentScrollY: window.scrollY,
          targetViewportTop: target.getBoundingClientRect().top,
          stickyHeaderHeight:
            stickyHeader?.getBoundingClientRect().height ?? 0,
        }),
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
