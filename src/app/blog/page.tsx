import type { Metadata } from "next";

import { PostCard } from "@/components/blog/post-card";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { CategoryFilter } from "@/components/shared/category-filter";
import {
  blogCategories,
  posts,
  postsByCategory,
  type BlogCategorySlug,
} from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guides on company registration, GST and tax, trademarks, funding and compliance — written for Indian founders and businesses.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const activeCategory = blogCategories.find((c) => c.slug === category)?.slug as
    | BlogCategorySlug
    | undefined;

  const items = activeCategory ? postsByCategory(activeCategory) : posts;
  const sorted = [...items].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return (
    <>
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
            Blog
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Straight answers on <em className="text-accent-strong">running a business.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Registration, GST, trademarks, funding and compliance — explained
            the way we&apos;d explain it on a call.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CategoryFilter basePath="/blog" categories={blogCategories} active={activeCategory} />

        <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <Reveal key={post.slug} className="h-full">
              <PostCard post={post} headingLevel="h2" />
            </Reveal>
          ))}
        </RevealGroup>
      </div>

      <CTA />
    </>
  );
}
