import { ArrowRight, Download as DownloadIcon, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { RelatedServices } from "@/components/shared/related-services";
import { Button } from "@/components/ui/button";
import {
  downloads,
  getDownload,
  getDownloadCategory,
} from "@/lib/downloads";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return downloads.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const download = getDownload(slug);
  if (!download) return {};
  return {
    title: download.title,
    description: download.description,
    alternates: { canonical: `/downloads/${slug}` },
    openGraph: {
      title: download.title,
      description: download.description,
      url: `/downloads/${slug}`,
      images: ["/og.png"],
    },
  };
}

export default async function DownloadPage({ params }: Props) {
  const { slug } = await params;
  const download = getDownload(slug);
  if (!download) notFound();

  const category = getDownloadCategory(download.category);

  return (
    <>
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/downloads" className="transition-colors hover:text-accent-strong">
                  Downloads
                </Link>
              </li>
              {category ? (
                <>
                  <li aria-hidden>/</li>
                  <li>
                    <Link
                      href={`/downloads?category=${category.slug}`}
                      className="transition-colors hover:text-accent-strong"
                    >
                      {category.title}
                    </Link>
                  </li>
                </>
              ) : null}
            </ol>
          </nav>

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <span className="inline-flex size-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                <FileText className="size-5" aria-hidden />
              </span>
              <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                {download.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {download.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href={download.fileUrl} download>
                    <DownloadIcon aria-hidden />
                    Download PDF
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">
                    Talk to an expert
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <dl className="space-y-4">
                <div>
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    File type
                  </dt>
                  <dd className="mt-1 text-lg">PDF document</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    Size
                  </dt>
                  <dd className="mt-1 text-lg">{download.fileSizeLabel}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    Last updated
                  </dt>
                  <dd className="mt-1 text-lg">
                    {new Date(download.updatedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {download.relatedServiceSlugs.length > 0 && (
        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Reveal>
              <RelatedServices
                slugs={download.relatedServiceSlugs}
                heading="Need help with this?"
              />
            </Reveal>
          </div>
        </section>
      )}

      <CTA />
    </>
  );
}
