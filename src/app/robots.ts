import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated/private areas and machine endpoints — no SEO value,
      // and portal pages would index as thin/duplicate sign-in redirects.
      disallow: ["/portal/", "/admin/", "/api/", "/unsubscribe"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
