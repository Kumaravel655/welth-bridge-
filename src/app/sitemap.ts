import type { MetadataRoute } from "next";

import { posts } from "@/lib/blog";
import { downloads } from "@/lib/downloads";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/services",
    "/tools",
    "/downloads",
    "/blog",
    "/compliance-calendar",
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const servicePages = services.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const toolPages = tools.map((t) => ({
    url: `${site.url}/tools/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const downloadPages = downloads.map((d) => ({
    url: `${site.url}/downloads/${d.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const blogPages = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...toolPages, ...downloadPages, ...blogPages];
}
