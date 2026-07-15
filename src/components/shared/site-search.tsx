"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { FileText, Landmark, Search, Wrench, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { search, searchResultKindLabel, type SearchResultKind } from "@/lib/search";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<SearchResultKind, React.ElementType> = {
  service: Landmark,
  blog: FileText,
  tool: Wrench,
  compliance: FileText,
};

export function SiteSearch({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTyping)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = search(query);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Search the site"
          suppressHydrationWarning
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            className
          )}
        >
          <Search className="size-[18px]" aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-24 z-50 w-full max-w-xl -translate-x-1/2 rounded-2xl border border-border bg-background text-foreground shadow-2xl focus:outline-none"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            document.getElementById("site-search-input")?.focus();
          }}
        >
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              id="site-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, tools, blog, compliance dates…"
              className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close search"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query.trim() && results.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;.
              </p>
            )}
            {results.map((result) => {
              const Icon = KIND_ICON[result.kind];
              return (
                <Dialog.Close asChild key={result.id}>
                  <Link
                    href={result.href}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                  >
                    <Icon
                      className="mt-0.5 size-4 shrink-0 text-accent-strong"
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {result.title}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {result.subtitle}
                      </span>
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
                      {searchResultKindLabel(result.kind)}
                    </span>
                  </Link>
                </Dialog.Close>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
