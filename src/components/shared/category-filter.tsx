import Link from "next/link";

import { cn } from "@/lib/utils";

export function CategoryFilter({
  basePath,
  categories,
  active,
}: {
  basePath: string;
  categories: { slug: string; title: string }[];
  active?: string;
}) {
  return (
    <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={cn(
          "rounded-full border px-4 py-1.5 text-sm transition-colors",
          !active
            ? "border-accent bg-accent/10 text-accent-strong"
            : "border-border text-muted-foreground hover:border-accent/50 hover:text-accent-strong"
        )}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`${basePath}?category=${c.slug}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            active === c.slug
              ? "border-accent bg-accent/10 text-accent-strong"
              : "border-border text-muted-foreground hover:border-accent/50 hover:text-accent-strong"
          )}
        >
          {c.title}
        </Link>
      ))}
    </nav>
  );
}
