"use client";

import { useEffect, useRef, useState } from "react";

type HeroMediaProps = {
  className: string;
  videoClassName: string;
  readyClassName: string;
};

export default function HeroMedia({
  className,
  videoClassName,
  readyClassName,
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!video) return;

    const syncPlayback = () => {
      if (reducedMotion.matches) {
        video.pause();
        video.currentTime = 0;
        setVideoReady(false);
        return;
      }

      void video.play().catch(() => {
        // The poster remains a complete visual fallback when autoplay is unavailable.
        setVideoReady(false);
      });
    };

    syncPlayback();
    reducedMotion.addEventListener("change", syncPlayback);

    return () => {
      reducedMotion.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <div
      className={`${className} ${videoReady ? readyClassName : ""}`}
      aria-hidden="true"
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
