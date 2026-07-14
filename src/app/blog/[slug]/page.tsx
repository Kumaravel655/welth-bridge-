import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentBlockRenderer } from "@/components/blog/content-blocks";
import { PostCard } from "@/components/blog/post-card";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { RelatedServices } from "@/components/shared/related-services";
import { Badge } from "@/components/ui/badge";
import {
  estimateReadingTime,
  getBlogCategory,
  getPost,
  posts,
  relatedPosts,
} from "@/lib/blog";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const category = getBlogCategory(post.category);
  const readingTime = estimateReadingTime(post.content);
  const related = relatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/blog" className="transition-colors hover:text-accent-strong">
                  Blog
                </Link>
              </li>
              {category ? (
                <>
                  <li aria-hidden>/</li>
                  <li>
                    <Link
                      href={`/blog?category=${category.slug}`}
                      className="transition-colors hover:text-accent-strong"
                    >
                      {category.title}
                    </Link>
                  </li>
                </>
              ) : null}
            </ol>
          </nav>

          {category ? (
            <Badge variant="accent" className="mt-6">
              {category.title}
            </Badge>
          ) : null}
          <h1 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{post.excerpt}</p>
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            &middot; {readingTime} min read
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <ContentBlockRenderer blocks={post.content} />

        <div className="mt-12 border-t border-border pt-10">
          <NewsletterForm variant="inline" source={`blog:${post.slug}`} />
        </div>
      </article>

      {post.relatedServiceSlugs.length > 0 && (
        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <RelatedServices slugs={post.relatedServiceSlugs} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">More reading</h2>
            </Reveal>
            <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Reveal key={p.slug} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <CTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
