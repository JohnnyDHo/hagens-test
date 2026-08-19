import type { MetadataRoute } from "next";
import { getRequestOrigin } from "@/lib/site-origin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getRequestOrigin();

  return [
    {
      url: new URL("/", origin).href,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

