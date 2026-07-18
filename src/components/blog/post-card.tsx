import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { estimateReadingTime, getBlogCategory, type BlogPost } from "@/lib/blog";

export function PostCard({
  post,
  headingLevel = "h3",
}: {
  post: BlogPost;
  /** Use "h2" when this card is a direct child of a page h1 with no h2 section above it. */
  headingLevel?: "h2" | "h3";
}) {
  const category = getBlogCategory(post.category);
  const readingTime = estimateReadingTime(post.content);
  const Heading = headingLevel;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/[0.08]"
    >
      {category ? <Badge variant="accent">{category.title}</Badge> : null}
      <Heading className="mt-4 font-display text-xl tracking-tight">{post.title}</Heading>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="font-mono text-xs text-muted-foreground">
          {new Date(post.publishedAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          &middot; {readingTime} min read
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-strong">
          Read
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
