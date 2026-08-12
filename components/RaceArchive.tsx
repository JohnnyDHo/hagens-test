"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./RaceArchive.module.css";

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
  const isOpen = activeIndex !== null;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const priorBodyOverflow = useRef("");

  const openFrame = (index: number) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    setActiveIndex(index);
    if (!dialog.open) dialog.showModal();
  };

  const closeArchive = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  };

  const moveFrame = (direction: -1 | 1) => {
    setActiveIndex((current) => {
      if (current === null) return 0;
      return (current + direction + archiveFrames.length) % archiveFrames.length;
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    priorBodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = priorBodyOverflow.current;
    };
  }, [isOpen]);

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
          const lastIndex = activeIndex;
          setActiveIndex(null);
          if (lastIndex !== null) {
            window.requestAnimationFrame(() => {
              triggerRefs.current[lastIndex]?.focus({ preventScroll: true });
            });
          }
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
