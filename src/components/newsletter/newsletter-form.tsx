"use client";

import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

export function NewsletterForm({
  variant = "footer",
  source,
  className,
}: {
  variant?: "footer" | "inline";
  source: string;
  className?: string;
}) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");

    try {
      const res = await fetch("/api/public/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.detail || "Something went wrong.");
      }

      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
      setStatus("error");
    }
  }

  if (variant === "footer") {
    return (
      <div className={cn("mt-6", className)}>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
          Get updates
        </p>
        {status === "sent" ? (
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-foreground/90">
            <CheckCircle2 className="size-4 text-accent" aria-hidden />
            You&apos;re on the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <input
              type="email"
              name="email"
              required
              aria-label="Email address"
              placeholder="you@example.com"
              className="h-10 w-full max-w-[220px] rounded-full border border-ink-border bg-ink-raised px-4 text-sm text-ink-foreground placeholder:text-ink-muted focus-visible:border-accent"
              suppressHydrationWarning
            />
            <button
              type="submit"
              disabled={status === "sending"}
              aria-label="Subscribe"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-all hover:brightness-105 disabled:opacity-50"
              suppressHydrationWarning
            >
              {status === "sending" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <ArrowRight className="size-4" aria-hidden />
              )}
            </button>
          </form>
        )}
        {status === "error" && (
          <p role="alert" className="mt-2 text-xs text-red-400">
            {errorMsg}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 sm:p-8", className)}>
      {status === "sent" ? (
        <div role="status" className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="size-8 text-accent-strong" aria-hidden />
          <h3 className="mt-3 font-display text-lg tracking-tight">You&apos;re subscribed!</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            We&apos;ll email you when there&apos;s something worth reading.
          </p>
        </div>
      ) : (
        <>
          <h3 className="font-display text-lg tracking-tight">Enjoyed this? Get more like it.</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            One email whenever we publish something genuinely useful — no spam.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              name="email"
              required
              aria-label="Email address"
              placeholder="you@example.com"
              className="sm:flex-1"
              suppressHydrationWarning
            />
            <Button type="submit" disabled={status === "sending"} suppressHydrationWarning>
              {status === "sending" ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Subscribing…
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight aria-hidden />
                </>
              )}
            </Button>
          </form>
          {status === "error" && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive"
            >
              {errorMsg}
            </p>
          )}
        </>
      )}
    </div>
  );
}
