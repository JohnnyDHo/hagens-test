import type { Metadata, Viewport } from "next";
import { getRequestOrigin } from "@/lib/site-origin";
import "./globals.css";

const SITE_TITLE = "Everyone Can Race | Hagens Berman Racing Seattle";
const SITE_DESCRIPTION =
  "Seattle’s amateur cycling team for road, cyclocross, gravel, track, and mountain bike racing. Everyone can race.";
const SOCIAL_IMAGE_ALT =
  "Hagens Berman Racing Seattle cyclists cresting a forest road beneath the words Everyone Can Race";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#14539e",
};

export const metadata: Metadata = {
  title: {
    default: "Hagens Berman Racing Seattle",
    template: "%s | Hagens Berman Racing Seattle",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Hagens Berman Racing Seattle",
  category: "sports",
  creator: "Hagens Berman Racing Seattle",
  publisher: "Hagens Berman Racing Seattle",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hagens Berman Racing Seattle",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const origin = await getRequestOrigin();
  const canonicalUrl = new URL("/", origin).href;
  const socialImageUrl = new URL("/og.png", origin).href;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "@id": `${canonicalUrl}#team`,
    name: "Hagens Berman Racing Seattle",
    url: canonicalUrl,
    description: SITE_DESCRIPTION,
    sport: [
      "Road cycling",
      "Gravel cycling",
      "Cyclocross",
      "Track cycling",
      "Mountain biking",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Seattle",
      addressRegion: "WA",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "Place",
      name: "Pacific Northwest",
    },
    nonprofitStatus: "https://schema.org/Nonprofit501c3",
    sameAs: [
      "https://www.hbsccycling.com/",
      "https://www.instagram.com/hagensbermancycling/",
      "https://www.facebook.com/HagensBermanCyclingTeam/",
    ],
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/geist-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/geist-mono-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={socialImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content={SOCIAL_IMAGE_ALT} />
        <meta name="twitter:image" content={socialImageUrl} />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
        <meta name="twitter:image:alt" content={SOCIAL_IMAGE_ALT} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
