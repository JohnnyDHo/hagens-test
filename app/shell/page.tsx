import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import styles from "./shell.module.css";

export const metadata: Metadata = {
  title: "Global Shell",
  description: "Responsive navigation and footer specimen for Hagens Berman Racing Seattle.",
  robots: { index: false, follow: false },
};

export default function ShellPage() {
  return (
    <div className={styles.shell} id="top">
      <SiteHeader />

      <main className={styles.page} id="main-content" tabIndex={-1}>
        <section className={styles.intro} aria-labelledby="shell-title">
          <p className={styles.eyebrow}>Piece 03 / Responsive shell specimen</p>
          <h1 id="shell-title">Built for the sharp end of the bunch.</h1>
          <p className={styles.dek}>
            Hagens Berman Racing Seattle brings riders together across road,
            cyclocross, gravel, track, and mountain bike racing.
          </p>
          <p className={styles.qaNote}>
            This route tests the global navigation, sticky behavior, and footer.
            Final homepage storytelling arrives in later pieces.
          </p>
        </section>

        <section className={styles.imageBand} aria-label="Hagens Berman Racing team photograph">
          <figure>
            <Image
              src="/media/team.webp"
              alt="Hagens Berman teammates gathered with their bikes before a race"
              fill
              priority
              sizes="100vw"
            />
            <figcaption>
              <span>Official HBR gallery / Team portrait</span>
              Seattle, Washington
            </figcaption>
          </figure>
        </section>

        <section className={styles.scrollCheck} aria-label="Sticky header scroll check">
          <p>Five disciplines / One team</p>
          <blockquote>
            “We race as a team, not as a group of individuals wearing the same kit.”
          </blockquote>
          <small>Keep scrolling to review the full footer system.</small>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
