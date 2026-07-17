import { ArrowRight, Check, Clock, FileText, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Image from "next/image";

import { PostCard } from "@/components/blog/post-card";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { CTA } from "@/components/sections/cta";
import { FaqAccordion, faqJsonLd } from "@/components/shared/faq-accordion";
import { RelatedServices } from "@/components/shared/related-services";
import { ToolCard } from "@/components/tools/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { posts } from "@/lib/blog";
import {
  getCategory,
  getServiceFaqs,
  getService,
  services,
  servicesByCategory,
} from "@/lib/services";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";
import { formatINR } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: service.name,
      description: service.description,
      url: `/services/${slug}`,
      images: ["/og.png"],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const category = getCategory(service.category);
  const related = servicesByCategory(service.category)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);
  const relatedTools = tools.filter((t) => t.relatedServiceSlugs.includes(service.slug));
  const relatedPosts = posts.filter((p) => p.relatedServiceSlugs.includes(service.slug)).slice(0, 3);
  const faqs = getServiceFaqs(service);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${site.url}/services/${service.slug}`,
    provider: { "@type": "ProfessionalService", name: site.name, url: site.url },
    areaServed: "IN",
    ...(service.price
      ? {
          offers: {
            "@type": "Offer",
            price: service.price,
            priceCurrency: "INR",
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
      {
        "@type": "ListItem",
        position: 3,
        name: service.name,
        item: `${site.url}/services/${service.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/services" className="transition-colors hover:text-accent-strong">
                  Services
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/services#${category.slug}`}
                  className="transition-colors hover:text-accent-strong"
                >
                  {category.navLabel}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <Badge variant="accent">{service.group}</Badge>
              <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                {service.name}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {service.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/portal/consultations">
                    Book a consultation
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
                    <Phone aria-hidden />
                    Talk to an expert
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Not sure yet? Book a free slot for a fee enquiry — we&apos;ll
                confirm the exact cost, documents and timeline before you
                commit.
              </p>
            </div>

            <div className="space-y-5">
              {/* Realistic category image */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border">
                <Image
                  src={`/images/categories/${service.category}.png`}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Fact panel */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <dl className="space-y-4">
                {service.price ? (
                  <div>
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                      Professional fee
                    </dt>
                    <dd className="mt-1 font-display text-3xl tracking-tight">
                      {formatINR(service.price)}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    Timeline
                  </dt>
                  <dd className="mt-1 inline-flex items-center gap-2 text-lg">
                    <Clock className="size-4 text-accent-strong" aria-hidden />
                    {service.timeline}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    Handled by
                  </dt>
                  <dd className="mt-1 text-sm text-foreground/90">
                    CAs, CSs &amp; corporate lawyers
                  </dd>
                </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-b border-border">
        <RevealGroup className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {service.highlights.map((h) => (
            <Reveal key={h} className="flex gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-accent-strong" aria-hidden />
              <p className="text-sm leading-relaxed">{h}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* Process + sidebar */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-strong">
                How it works
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-tight">
                The crossing, step by step
              </h2>
            </Reveal>
            <RevealGroup className="mt-8">
              <ol className="space-y-0">
                {service.process.map((step, i) => (
                  <Reveal as="li" key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                    {i < service.process.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-5 top-11 h-[calc(100%-2.5rem)] w-px bg-border"
                      />
                    )}
                    <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent/10 font-mono text-sm font-semibold text-accent-strong">
                      {i + 1}
                    </span>
                    <div className="pt-1.5">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </RevealGroup>
          </div>

          <div className="space-y-6">
            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 font-display text-lg tracking-tight">
                  <Check className="size-4 text-accent-strong" aria-hidden />
                  What&apos;s included
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {service.includes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-accent-strong" aria-hidden />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="flex items-center gap-2 font-display text-lg tracking-tight">
                  <FileText className="size-4 text-accent-strong" aria-hidden />
                  Documents you&apos;ll need
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {service.documents.map((doc) => (
                    <li key={doc} className="flex gap-2.5 text-sm">
                      <span
                        aria-hidden
                        className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span className="text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  Missing something? Start anyway — we&apos;ll help you obtain
                  whatever&apos;s not on hand.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <RelatedServices
              slugs={related.map((s) => s.slug)}
              heading={`More in ${category.title}`}
            />
          </div>
        </section>
      )}

      {/* Related tools & reading */}
      {(relatedTools.length > 0 || relatedPosts.length > 0) && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl space-y-14 px-4 py-16 sm:px-6 lg:px-8">
            {relatedTools.length > 0 && (
              <div>
                <Reveal>
                  <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                    Related tools
                  </h2>
                </Reveal>
                <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedTools.map((tool) => (
                    <Reveal key={tool.slug} className="h-full">
                      <ToolCard tool={tool} />
                    </Reveal>
                  ))}
                </RevealGroup>
              </div>
            )}

            {relatedPosts.length > 0 && (
              <div>
                <Reveal>
                  <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                    Related reading
                  </h2>
                </Reveal>
                <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <Reveal key={post.slug} className="h-full">
                      <PostCard post={post} />
                    </Reveal>
                  ))}
                </RevealGroup>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <FaqAccordion heading="Frequently asked questions" items={faqs} />
        </div>
      </section>

      <CTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
    </>
  );
}
