import Link from "next/link";
import styles from "./SiteFooter.module.css";

const footerLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/hagensbermancycling/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/HagensBermanCyclingTeam/",
  },
  { label: "Join", href: "https://www.hbsccycling.com/join-us" },
  { label: "Store", href: "https://www.hbsccycling.com/store" },
] as const;

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topLine}>
        <Link className={styles.brand} href="/" aria-label="Hagens Berman Racing home">
          <span className={styles.brandMark} aria-hidden="true">
            HB
          </span>
          <span>
            Hagens Berman Racing
            <small>Seattle, Washington</small>
          </span>
        </Link>

        <p className={styles.statement}>
          Five disciplines.
          <br />
          One team.
        </p>
      </div>

      <div className={styles.linkGrid}>
        <div className={styles.legal}>
          <p>Pedali Inc. / HBR Seattle</p>
          <p>501(c)(3) nonprofit cycling team</p>
        </div>

        <nav aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label} (opens in a new tab)`}
              key={item.label}
            >
              {item.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </div>

      <div className={styles.endLine}>
        <div>
          <p>© 2026 Hagens Berman Racing Seattle</p>
          <p>Road / Cyclocross / Gravel / Track / Mountain bike</p>
        </div>
        <a href="#top">Back to start <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
