import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
        404 — Page not found
      </p>
      <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        This bridge doesn&apos;t <em className="text-accent-strong">go there.</em>
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
        The page you&apos;re looking for has moved or never existed. Every
        service we offer is one search away.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/services">
            <Search aria-hidden />
            Browse all services
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            Back to home
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
