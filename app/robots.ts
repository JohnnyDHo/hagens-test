import type { MetadataRoute } from "next";
import { getRequestOrigin } from "@/lib/site-origin";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getRequestOrigin();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", origin).href,
  };
}
