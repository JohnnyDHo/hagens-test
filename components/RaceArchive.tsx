"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RaceArchive.module.css";

type InlinePageStyles = {
  position: string;
  top: string;
  left: string;
  width: string;
  overflow: string;
  overscrollBehavior: string;
  paddingRight: string;
  scrollBehavior: string;
};

type PageLock = {
  x: number;
  y: number;
  rootStyles: InlinePageStyles;
  bodyStyles: InlinePageStyles;
  preventOutsideWheel: (event: WheelEvent) => void;
  preventOutsideTouch: (event: TouchEvent) => void;
};

const captureInlinePageStyles = (element: HTMLElement): InlinePageStyles => ({
  position: element.style.position,
  top: element.style.top,
  left: element.style.left,
  width: element.style.width,
  overflow: element.style.overflow,
  overscrollBehavior: element.style.overscrollBehavior,
  paddingRight: element.style.paddingRight,
  scrollBehavior: element.style.scrollBehavior,
});

const restoreInlinePageStyles = (
  element: HTMLElement,
  styles: InlinePageStyles,
) => {
  element.style.position = styles.position;
  element.style.top = styles.top;
  element.style.left = styles.left;
  element.style.width = styles.width;
  element.style.overflow = styles.overflow;
  element.style.overscrollBehavior = styles.overscrollBehavior;
  element.style.paddingRight = styles.paddingRight;
  element.style.scrollBehavior = styles.scrollBehavior;
};

const archiveFrames = [
  {
    src: "/media/race-04.webp",
    width: 750,
    height: 500,
    alt: "A group of cyclists riding toward the crest of a forest road",
    note: "Road through forest",
  },
  {
    src: "/media/mason-03.webp",
    width: 750,
    height: 600,
    alt: "A bike race sign on a support vehicle beside gathered cyclists",
    note: "Race-day signage",
  },
  {
    src: "/media/race-02.webp",
    width: 750,
    height: 500,
    alt: "A large group of cyclists gathered with their bikes among trees",
    note: "Riders gathered",
  },
  {
    src: "/media/mason-04.webp",
    width: 750,
    height: 500,
    alt: "A cyclist riding alone along a winding road lined by evergreens",
    note: "Open road",
  },
  {
    src: "/media/mason-05.webp",
    width: 750,
    height: 600,
    alt: "Cyclists passing through a forest with motion visible in the foreground",
    note: "Roadside motion",
  },
  {
    src: "/media/race-01.webp",
    width: 750,
    height: 500,
    alt: "Cyclists and race supporters gathered together on a wooded road",
    note: "Race community",
  },
  {
    src: "/media/mason-06.webp",
    width: 750,
    height: 500,
    alt: "A group of cyclists riding on a two-lane road through tall trees",
    note: "Course through trees",
  },
] as const;

export default function RaceArchive() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const originRef = useRef<{
    element: HTMLButtonElement;
    index: number;
    x: number;
    y: number;
  } | null>(null);
  const pageLockRef = useRef<PageLock | null>(null);
  const focusFrameRef = useRef<number | null>(null);

  const lockPage = useCallback((x: number, y: number) => {
    if (pageLockRef.current) return;

    const root = document.documentElement;
    const body = document.body;
    const dialog = dialogRef.current;
    const eventTargetsDialog = (target: EventTarget | null) =>
      target instanceof Node && dialog?.contains(target);
    const preventOutsideWheel = (event: WheelEvent) => {
      if (!eventTargetsDialog(event.target)) event.preventDefault();
    };
    const preventOutsideTouch = (event: TouchEvent) => {
      if (!eventTargetsDialog(event.target)) event.preventDefault();
    };

    pageLockRef.current = {
      x,
      y,
      rootStyles: captureInlinePageStyles(root),
      bodyStyles: captureInlinePageStyles(body),
      preventOutsideWheel,
      preventOutsideTouch,
    };

    root.style.scrollBehavior = "auto";
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = `-${x}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    document.addEventListener("wheel", preventOutsideWheel, {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchmove", preventOutsideTouch, {
      capture: true,
      passive: false,
    });
  }, []);

  const restorePage = useCallback((restoreFocus: boolean) => {
    if (focusFrameRef.current !== null) {
      window.cancelAnimationFrame(focusFrameRef.current);
      focusFrameRef.current = null;
    }

    const pageLock = pageLockRef.current;
    const origin = originRef.current;
    if (!pageLock) {
      if (restoreFocus) origin?.element.focus({ preventScroll: true });
      originRef.current = null;
      return;
    }

    document.removeEventListener(
      "wheel",
      pageLock.preventOutsideWheel,
      true,
    );
    document.removeEventListener(
      "touchmove",
      pageLock.preventOutsideTouch,
      true,
    );

    const root = document.documentElement;
    const body = document.body;
    const originalRootScrollBehavior = pageLock.rootStyles.scrollBehavior;
    restoreInlinePageStyles(root, {
      ...pageLock.rootStyles,
      scrollBehavior: "auto",
    });
    restoreInlinePageStyles(body, pageLock.bodyStyles);
    window.scrollTo(pageLock.x, pageLock.y);
    root.style.scrollBehavior = originalRootScrollBehavior;
    if (restoreFocus) origin?.element.focus({ preventScroll: true });

    pageLockRef.current = null;
    originRef.current = null;
  }, []);

  const openFrame = (index: number) => {
    const dialog = dialogRef.current;
    const originElement = triggerRefs.current[index];
    if (!dialog || !originElement) return;

    if (!dialog.open) {
      const x = window.scrollX;
      const y = window.scrollY;
      originRef.current = { element: originElement, index, x, y };
      lockPage(x, y);
    }

    try {
      if (!dialog.open) dialog.showModal();
      setActiveIndex(index);
      focusFrameRef.current = window.requestAnimationFrame(() => {
        focusFrameRef.current = null;
        closeButtonRef.current?.focus({ preventScroll: true });
      });
    } catch {
      setActiveIndex(null);
      restorePage(false);
    }
  };

  const closeArchive = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, []);

  const moveFrame = (direction: -1 | 1) => {
    setActiveIndex((current) => {
      if (current === null) return 0;
      return (current + direction + archiveFrames.length) % archiveFrames.length;
    });
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const closeFromBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) closeArchive();
    };
    dialog?.addEventListener("click", closeFromBackdrop);
    return () => {
      dialog?.removeEventListener("click", closeFromBackdrop);
      if (dialog?.open) dialog.close();
      restorePage(true);
    };
  }, [closeArchive, restorePage]);

  return (
    <section className={styles.archive} id="gallery" aria-labelledby="gallery-title">
      <header className={styles.masthead}>
        <div className={styles.index}>
          <span>04</span>
          <p>Race archive / 07 frames</p>
        </div>

        <div className={styles.heading}>
          <p>Official HBR photography</p>
          <h2 id="gallery-title">
            Race
            <em>archive.</em>
          </h2>
        </div>

        <div className={styles.intro}>
          <p>
            An edit from the official HBR and Mason Lake race archive—people,
            wheels, roads, and the Pacific Northwest landscape around them.
          </p>
          <p className={styles.exploreHint}>
            <span aria-hidden="true">↔</span> Select a frame to explore
          </p>
        </div>
      </header>

      <div className={styles.sequenceHeader} aria-hidden="true">
        <p>Contact sheet / HBR Seattle</p>
        <span>ML · 01—07</span>
      </div>

      <ol className={styles.archiveList} aria-label="Selected race archive photographs">
        {archiveFrames.map((frame, index) => {
          const frameNumber = String(index + 1).padStart(2, "0");

          return (
            <li className={styles.archiveItem} key={frame.src}>
              <figure>
                <button
                  className={styles.frameButton}
                  type="button"
                  onClick={() => openFrame(index)}
                  ref={(element) => {
                    triggerRefs.current[index] = element;
                  }}
                  aria-label={`Open frame ${frameNumber}: ${frame.note}`}
                >
                  <span className={styles.frameCrop}>
                    <Image
                      src={frame.src}
                      alt={frame.alt}
                      width={frame.width}
                      height={frame.height}
                      sizes="(max-width: 760px) 84vw, (max-width: 1120px) 52vw, 50vw"
                      loading="lazy"
                      unoptimized
                    />
                  </span>
                  <span className={styles.openMark} aria-hidden="true">
                    +
                  </span>
                </button>
                <figcaption>
                  <span>{frameNumber} / 07</span>
                  <p>{frame.note}</p>
                  <span>Official HBR / Mason Lake race archive</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ol>

      <footer className={styles.archiveFooter}>
        <div>
          <p>Full official archive</p>
          <span>
            HBR welcomes photo sharing with a tag to @hagensbermancycling.
          </span>
        </div>
        <a
          href="https://www.hbsccycling.com/2026-mason-lake-1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View the official HBR Mason Lake photo gallery (opens in a new tab)"
        >
          View the Mason Lake gallery <span aria-hidden="true">↗</span>
        </a>
      </footer>

      <dialog
        className={styles.lightbox}
        ref={dialogRef}
        aria-labelledby="archive-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeArchive();
        }}
        onClose={() => {
          setActiveIndex(null);
          restorePage(true);
        }}
      >
        {activeIndex !== null ? (
          <div className={styles.lightboxInner}>
            <header className={styles.lightboxHeader}>
              <p id="archive-dialog-title">Official HBR / Mason Lake race archive</p>
              <p aria-live="polite" aria-atomic="true">
                Frame {String(activeIndex + 1).padStart(2, "0")} of {archiveFrames.length}
              </p>
              <button
                type="button"
                ref={closeButtonRef}
                onClick={closeArchive}
                aria-label="Close race archive viewer"
              >
                Close <span aria-hidden="true">×</span>
              </button>
            </header>

            <figure className={styles.lightboxFigure}>
              <Image
                src={archiveFrames[activeIndex].src}
                alt={archiveFrames[activeIndex].alt}
                width={archiveFrames[activeIndex].width}
                height={archiveFrames[activeIndex].height}
                sizes="(max-width: 760px) calc(100vw - 32px), 750px"
                unoptimized
              />
              <figcaption>
                <span>{archiveFrames[activeIndex].note}</span>
                <span>Official HBR / Mason Lake race archive</span>
              </figcaption>
            </figure>

            <nav className={styles.lightboxControls} aria-label="Race archive controls">
              <button type="button" onClick={() => moveFrame(-1)}>
                <span aria-hidden="true">←</span> Previous
              </button>
              <button type="button" onClick={() => moveFrame(1)}>
                Next <span aria-hidden="true">→</span>
              </button>
            </nav>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
