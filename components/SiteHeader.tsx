"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";

const MOBILE_NAVIGATION_ID = "hbr-site-navigation";

const primaryNavigation = [
  { label: "Home", href: "/" },
  { label: "Team", href: "/#team" },
  { label: "Events", href: "/#events" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Partners", href: "/#partners" },
  { label: "Join", href: "/#join" },
] as const;

const utilityNavigation = [
  { label: "Members calendar", href: "https://www.hbsccycling.com/calendar" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/hagensbermancycling/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/HagensBermanCyclingTeam/",
  },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(false);
  const scrollCaptureRef = useRef<{ x: number; y: number } | null>(null);

  const closeMenu = () => {
    menuOpenRef.current = false;
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
      return;
    }

    scrollCaptureRef.current = { x: window.scrollX, y: window.scrollY };
    menuOpenRef.current = true;
    setMenuOpen(true);
  };

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  useLayoutEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const body = document.body;
    const menuButton = menuButtonRef.current;
    const mobileMenu = mobileMenuRef.current;
    const firstLink = mobileMenu?.querySelector<HTMLAnchorElement>("a");
    const scrollCapture = scrollCaptureRef.current;

    if (!scrollCapture) return;

    const { x: scrollX, y: scrollY } = scrollCapture;
    const rootStyles = {
      overflow: root.style.overflow,
      overscrollBehavior: root.style.overscrollBehavior,
      scrollBehavior: root.style.scrollBehavior,
    };
    const bodyStyles = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
    };

    root.style.scrollBehavior = "auto";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.width = "100%";
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    firstLink?.focus({ preventScroll: true });

    const eventTargetsMenu = (target: EventTarget | null) =>
      target instanceof Node && mobileMenu?.contains(target);

    const preventBackgroundWheel = (event: WheelEvent) => {
      if (!eventTargetsMenu(event.target)) event.preventDefault();
    };

    const preventBackgroundTouch = (event: TouchEvent) => {
      if (!eventTargetsMenu(event.target)) event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        menuOpenRef.current = false;
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !mobileMenu) return;

      const focusableElements = [
        menuButton,
        ...mobileMenu.querySelectorAll<HTMLAnchorElement>("a[href]"),
      ].filter((element): element is HTMLElement => element !== null);

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", preventBackgroundWheel, {
      capture: true,
      passive: false,
    });
    document.addEventListener("touchmove", preventBackgroundTouch, {
      capture: true,
      passive: false,
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", preventBackgroundWheel, true);
      document.removeEventListener("touchmove", preventBackgroundTouch, true);
      root.style.overflow = rootStyles.overflow;
      root.style.overscrollBehavior = rootStyles.overscrollBehavior;
      body.style.overflow = bodyStyles.overflow;
      body.style.overscrollBehavior = bodyStyles.overscrollBehavior;
      body.style.position = bodyStyles.position;
      body.style.top = bodyStyles.top;
      body.style.left = bodyStyles.left;
      body.style.width = bodyStyles.width;
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = rootStyles.scrollBehavior;
      menuButton?.focus({ preventScroll: true });

      if (!menuOpenRef.current && scrollCaptureRef.current === scrollCapture) {
        scrollCaptureRef.current = null;
      }
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        menuOpenRef.current = false;
        setMenuOpen(false);
      }
    };

    desktopMedia.addEventListener("change", closeAtDesktop);
    return () => desktopMedia.removeEventListener("change", closeAtDesktop);
  }, []);

  const noteNavigationTarget = (href: string) => {
    const hashStart = href.indexOf("#");
    setCurrentHash(hashStart === -1 ? "" : href.slice(hashStart));
  };
  const currentTarget = currentHash === null ? null : `${pathname}${currentHash}`;

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <header
        className={`${styles.header} ${menuOpen ? styles.headerMenuOpen : ""}`}
        data-site-header
      >
        <Link
          className={styles.brand}
          href="/"
          aria-label="Hagens Berman Racing Seattle home"
          onClick={closeMenu}
        >
          <span className={styles.brandMark} aria-hidden="true">
            HB
          </span>
          <span className={styles.brandName}>
            Hagens Berman Racing
            <small>Seattle, Washington</small>
          </span>
        </Link>

        <nav className={styles.desktopNavigation} aria-label="Primary navigation">
          {primaryNavigation.map((item) => {
            const isActive = currentTarget === item.href;

            return (
              <Link
                className={`${styles.primaryLink} ${isActive ? styles.activeLink : ""}`}
                href={item.href}
                aria-current={isActive ? (item.href.includes("#") ? "location" : "page") : undefined}
                onClick={() => noteNavigationTarget(item.href)}
                key={item.label}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          className={styles.membersLink}
          href="https://www.hbsccycling.com/calendar"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Members calendar (opens in a new tab)"
        >
          <span>Members calendar</span>
          <span aria-hidden="true">↗</span>
        </a>

        <button
          className={styles.menuButton}
          ref={menuButtonRef}
          type="button"
          aria-controls={MOBILE_NAVIGATION_ID}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={toggleMenu}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className={styles.menuGlyph} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <div
        className={styles.mobileMenu}
        id={MOBILE_NAVIGATION_ID}
        ref={mobileMenuRef}
        role="dialog"
        aria-label="Site navigation"
        aria-modal="true"
        hidden={!menuOpen}
      >
        <nav className={styles.mobilePrimary} aria-label="Mobile primary navigation">
          {primaryNavigation.map((item, index) => {
            const isActive = currentTarget === item.href;

            return (
              <Link
                className={isActive ? styles.mobileActive : ""}
                href={item.href}
                aria-current={isActive ? (item.href.includes("#") ? "location" : "page") : undefined}
                onClick={() => {
                  noteNavigationTarget(item.href);
                  closeMenu();
                }}
                key={item.label}
              >
                <span className={styles.mobileIndex} aria-hidden="true">
                  0{index + 1}
                </span>
                {item.label}
                <i aria-hidden="true">↘</i>
              </Link>
            );
          })}
        </nav>

        <div className={styles.mobileUtility}>
          <p>Team desk</p>
          {utilityNavigation.map((item) => (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              key={item.label}
            >
              {item.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          <small>Road / Cyclocross / Gravel / Track / Mountain bike</small>
        </div>
      </div>
    </>
  );
}
