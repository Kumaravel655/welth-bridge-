import { ArrowRight, Info, Lightbulb, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { getService } from "@/lib/services";
import { formatINR } from "@/lib/utils";
import type { ContentBlock } from "@/lib/blog";

const calloutIcons = {
  info: Info,
  warning: TriangleAlert,
  tip: Lightbulb,
};

const calloutClasses = {
  info: "border-border bg-muted/50 text-foreground",
  warning: "border-destructive/30 bg-destructive/10 text-foreground",
  tip: "border-accent/40 bg-accent/10 text-foreground",
};

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === 2 ? "h2" : "h3";
      return (
        <Tag
          className={
            block.level === 2
              ? "mt-10 font-display text-2xl tracking-tight sm:text-3xl"
              : "mt-8 font-display text-xl tracking-tight"
          }
        >
          {block.text}
        </Tag>
      );
    }
    case "paragraph":
      return <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{block.text}</p>;

    case "list": {
      const Tag = block.style === "number" ? "ol" : "ul";
      return (
        <Tag className="mt-4 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-2.5 text-base leading-relaxed text-muted-foreground">
              <span className="mt-1 shrink-0 font-mono text-xs text-accent-strong">
                {block.style === "number" ? `${i + 1}.` : "—"}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </Tag>
      );
    }

    case "callout": {
      const Icon = calloutIcons[block.tone];
      return (
        <div className={`mt-6 flex gap-3 rounded-2xl border p-5 ${calloutClasses[block.tone]}`}>
          <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            {block.title ? <p className="font-medium">{block.title}</p> : null}
            <p className="mt-1 text-sm leading-relaxed opacity-90">{block.text}</p>
          </div>
        </div>
      );
    }

    case "quote":
      return (
        <blockquote className="mt-6 border-l-2 border-accent pl-5 font-display text-xl italic leading-snug text-foreground">
          {block.text}
          {block.attribution ? (
            <footer className="mt-2 font-sans text-sm not-italic text-muted-foreground">
              — {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );

    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {block.headers.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-medium text-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 align-top text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "steps":
      return (
        <RevealGroup as="ol" className="mt-6 space-y-0">
          {block.items.map((step, i) => (
            <Reveal as="li" key={step.title} className="relative flex gap-5 pb-7 last:pb-0">
              {i < block.items.length - 1 && (
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
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      );

    case "cta": {
      const service = getService(block.serviceSlug);
      if (!service) return null;
      return (
        <Link
          href={`/services/${service.slug}`}
          className="group mt-6 flex items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-accent/10 p-5 transition-colors hover:border-accent"
        >
          <div>
            <p className="font-medium text-foreground">{block.label ?? service.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {service.short}
              {service.price ? ` · From ${formatINR(service.price)}` : ""}
            </p>
          </div>
          <ArrowRight
            className="size-5 shrink-0 text-accent-strong transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      );
    }

    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return (
        <figure className="mt-6">
          <img src={block.src} alt={block.alt} className="w-full rounded-2xl border border-border" />
          {block.caption ? (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
  }
}

export function ContentBlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
