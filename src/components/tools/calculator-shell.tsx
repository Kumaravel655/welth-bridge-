import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export function CalculatorShell({
  eyebrow,
  title,
  description,
  inputs,
  results,
  disclaimer,
  after,
}: {
  eyebrow: string;
  title: string;
  description: string;
  inputs: ReactNode;
  results: ReactNode;
  disclaimer?: string;
  after?: ReactNode;
}) {
  return (
    <>
      <section className="bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/tools" className="transition-colors hover:text-accent-strong">
                  Tools
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground/80">{title}</li>
            </ol>
          </nav>
          <Badge variant="accent" className="mt-6">
            {eyebrow}
          </Badge>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">{inputs}</div>
          <div className="space-y-6 lg:sticky lg:top-24">
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              {results}
            </div>
            {disclaimer ? (
              <p className="text-xs leading-relaxed text-muted-foreground">{disclaimer}</p>
            ) : null}
          </div>
        </div>
      </section>

      {after}
    </>
  );
}
