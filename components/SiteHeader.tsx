"use client";

import Link from "next/link";
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
  { label: "Members", href: "https://www.hbsccycling.com/calendar" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/hagensbermancycling/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/HagensBermanCyclingTeam/",
  },
] as const;

type SiteHeaderProps = {
  activeItem?: (typeof primaryNavigation)[number]["label"];
};

export default function SiteHeader({ activeItem }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationId = `site-navigation-${useId().replaceAll(":", "")}`;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    const mobileMenu = mobileMenuRef.current;
    const firstLink = mobileMenu?.querySelector<HTMLAnchorElement>("a");

    document.body.style.overflow = "hidden";
    firstLink?.focus();

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

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 981px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopMedia.addEventListener("change", closeAtDesktop);
    return () => desktopMedia.removeEventListener("change", closeAtDesktop);
  }, []);

  const closeMenu = () => setMenuOpen(false);

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
          {primaryNavigation.map((item) => (
            <Link
              className={`${styles.primaryLink} ${
                activeItem === item.label ? styles.activeLink : ""
              }`}
              href={item.href}
              aria-current={activeItem === item.label ? "page" : undefined}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className={styles.membersLink}
          href="https://www.hbsccycling.com/calendar"
        >
          <span>Members</span>
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
          {primaryNavigation.map((item, index) => (
            <Link
              className={activeItem === item.label ? styles.mobileActive : ""}
              href={item.href}
              aria-current={activeItem === item.label ? "page" : undefined}
              onClick={closeMenu}
              key={item.label}
            >
              <span aria-hidden="true">0{index + 1}</span>
              {item.label}
              <i aria-hidden="true">↘</i>
            </Link>
          ))}
        </nav>

        <div className={styles.mobileUtility}>
          <p>Team desk</p>
          {utilityNavigation.map((item) => (
            <a href={item.href} onClick={closeMenu} key={item.label}>
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
