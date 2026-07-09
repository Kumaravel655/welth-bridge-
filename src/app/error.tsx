"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
        Something went wrong
      </p>
      <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
        A plank came loose.
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
        The page hit an unexpected error. Try again — if it keeps happening,
        call us and we&apos;ll help the old-fashioned way.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>
          <RotateCcw aria-hidden />
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}
