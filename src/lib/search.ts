import { complianceDeadlines } from "./compliance-calendar";
import { posts } from "./blog";
import { services } from "./services";
import { tools } from "./tools";

export type SearchResultKind = "service" | "blog" | "tool" | "compliance";

export type SearchResult = {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  href: string;
};

const KIND_LABEL: Record<SearchResultKind, string> = {
  service: "Service",
  blog: "Blog",
  tool: "Tool",
  compliance: "Compliance calendar",
};

export function searchResultKindLabel(kind: SearchResultKind) {
  return KIND_LABEL[kind];
}

const index: SearchResult[] = [
  ...services.map((s) => ({
    id: `service-${s.slug}`,
    kind: "service" as const,
    title: s.name,
    subtitle: s.short,
    href: `/services/${s.slug}`,
  })),
  ...posts.map((p) => ({
    id: `blog-${p.slug}`,
    kind: "blog" as const,
    title: p.title,
    subtitle: p.excerpt,
    href: `/blog/${p.slug}`,
  })),
  ...tools.map((t) => ({
    id: `tool-${t.slug}`,
    kind: "tool" as const,
    title: t.name,
    subtitle: t.short,
    href: `/tools/${t.slug}`,
  })),
  ...complianceDeadlines.map((d) => ({
    id: `compliance-${d.slug}`,
    kind: "compliance" as const,
    title: d.title,
    subtitle: d.description,
    href: `/compliance-calendar?category=${d.category}`,
  })),
];

export function search(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return index
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
