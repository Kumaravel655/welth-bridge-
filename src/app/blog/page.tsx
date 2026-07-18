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
  alternates: { canonical: "/blog" },
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
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-950 text-center"
        style={{
          backgroundImage: 'url(/images/backgrounds/services-tax-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent-on-ink backdrop-blur-md mb-6">
              Blog
            </span>
            <h1 className="mx-auto max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
              Straight answers on <em className="text-accent-on-ink">running a business.</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Registration, GST, trademarks, funding and compliance — explained
              the way we&apos;d explain it on a call.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-slate-50 dark:bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/values-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-slate-50 from-30% via-slate-50/80 to-slate-50/10 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/10 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <CategoryFilter basePath="/blog" categories={blogCategories} active={activeCategory} />

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <Reveal key={post.slug} className="h-full">
                <PostCard post={post} headingLevel="h2" />
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTA />
    </>
  );
}
