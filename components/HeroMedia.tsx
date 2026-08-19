"use client";

import { useEffect, useRef, useState } from "react";

type HeroMediaProps = {
  className: string;
  videoClassName: string;
  readyClassName: string;
  motionHook?: boolean;
};

export default function HeroMedia({
  className,
  videoClassName,
  readyClassName,
  motionHook = false,
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!video) return;

    const syncPlayback = () => {
      if (reducedMotion.matches || document.visibilityState === "hidden") {
        video.pause();
        if (reducedMotion.matches) {
          video.currentTime = 0;
          setVideoReady(false);
        }
        return;
      }

      void video
        .play()
        .then(() => {
          if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            setVideoReady(true);
          }
        })
        .catch(() => {
          // The poster remains a complete visual fallback when autoplay is unavailable.
          setVideoReady(false);
        });
    };

    syncPlayback();
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <div
      className={`${className} ${videoReady ? readyClassName : ""}`}
      aria-hidden="true"
      data-motion-hero-media={motionHook ? "" : undefined}
    >
      <video
        ref={videoRef}
        className={videoClassName}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero-poster.jpg"
        disablePictureInPicture
        onCanPlay={() => setVideoReady(true)}
      >
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
