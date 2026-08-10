"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./SiteHeader.module.css";

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
  const navigationId = `site-navigation-${useId().replaceAll(":", "")}`;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const body = document.body;
    const menuButton = menuButtonRef.current;
    const mobileMenu = mobileMenuRef.current;
    const firstLink = mobileMenu?.querySelector<HTMLAnchorElement>("a");
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const rootStyles = {
      overflow: root.style.overflow,
      overscrollBehavior: root.style.overscrollBehavior,
      scrollBehavior: root.style.scrollBehavior,
    };
    const bodyStyles = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
    };

    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    firstLink?.focus();

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
      root.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = rootStyles.scrollBehavior;
      menuButton?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopMedia.addEventListener("change", closeAtDesktop);
    return () => desktopMedia.removeEventListener("change", closeAtDesktop);
  }, []);

  const closeMenu = () => setMenuOpen(false);
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
      <header className={styles.header}>
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
          aria-controls={navigationId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
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
        id={navigationId}
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
