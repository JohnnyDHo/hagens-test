import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hagens Berman Racing Seattle",
    short_name: "HBR Seattle",
    description:
      "Seattle’s amateur cycling team. Everyone can race.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f7f9",
    theme_color: "#14539e",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
