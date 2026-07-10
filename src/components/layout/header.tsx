"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { categories, groupsInCategory } from "@/lib/services";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Wordmark } from "./wordmark";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-border/60 bg-ink/85 text-ink-foreground backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <DesktopNav />

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="mr-1 hidden items-center gap-2 font-mono text-xs text-ink-muted transition-colors hover:text-ink-foreground xl:inline-flex"
          >
            <Phone className="size-3.5" aria-hidden />
            {site.phone}
          </a>
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">
              Get started
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */

const triggerClass =
  "group inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm text-ink-muted transition-colors hover:text-ink-foreground data-[state=open]:bg-ink-raised data-[state=open]:text-ink-foreground";

function DesktopNav() {
  return (
    <NavigationMenu.Root
      delayDuration={80}
      className="relative hidden lg:block"
    >
      <NavigationMenu.List className="flex items-center gap-0.5">
        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <Link href="/" className={triggerClass}>
              Home
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClass}>
            Services
            <ChevronDown
              className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-max">
            <AllServicesPanel />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {[
          { href: "/about", label: "About" },
          { href: "/contact", label: "Contact" },
        ].map((item) => (
          <NavigationMenu.Item key={item.href}>
            <NavigationMenu.Link asChild>
              <Link href={item.href} className={triggerClass}>
                {item.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
        <NavigationMenu.Viewport className="relative h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] origin-top overflow-hidden rounded-2xl border border-ink-border bg-ink-raised shadow-2xl shadow-black/40 transition-[width,height] duration-200" />
      </div>
    </NavigationMenu.Root>
  );
}

function AllServicesPanel() {
  return (
    <div className="p-6 w-[800px] max-w-[90vw]">
      <div className="mb-5 flex items-end justify-between gap-6 border-b border-ink-border pb-4">
        <div>
          <p className="font-display text-lg text-ink-foreground">Our Services</p>
          <p className="mt-0.5 text-xs text-ink-muted">Comprehensive solutions for your business</p>
        </div>
        <NavigationMenu.Link asChild>
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--accent)] hover:underline"
          >
            View all services
            <ArrowRight className="size-3" aria-hidden />
          </Link>
        </NavigationMenu.Link>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-3">
        {categories.map((cat) => {
          const groups = groupsInCategory(cat.slug);
          const topServices = groups.flatMap((g) => g.items).slice(0, 4);

          return (
            <div key={cat.slug}>
              <NavigationMenu.Link asChild>
                <Link
                  href={`/services#${cat.slug}`}
                  className="mb-2 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--accent)] hover:underline"
                >
                  {cat.title}
                </Link>
              </NavigationMenu.Link>
              <ul className="space-y-0.5">
                {topServices.map((s) => (
                  <li key={s.slug}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={`/services/${s.slug}`}
                        className="block rounded-md px-2 py-1.5 -mx-2 text-sm text-ink-foreground/90 transition-colors hover:bg-ink hover:text-[var(--accent)]"
                      >
                        {s.name}
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                ))}
                <li>
                  <NavigationMenu.Link asChild>
                    <Link
                      href={`/services#${cat.slug}`}
                      className="block rounded-md px-2 py-1.5 -mx-2 text-xs italic text-ink-muted transition-colors hover:text-[var(--accent)]"
                    >
                      + view more
                    </Link>
                  </NavigationMenu.Link>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          suppressHydrationWarning
          className="inline-flex size-9 items-center justify-center rounded-full border border-ink-border text-ink-foreground transition-colors hover:bg-ink-raised lg:hidden"
        >
          <Menu className="size-4" aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-ink text-ink-foreground shadow-2xl focus:outline-none">
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          <div className="flex h-16 items-center justify-between border-b border-ink-border px-5">
            <Wordmark />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                suppressHydrationWarning
                className="inline-flex size-9 items-center justify-center rounded-full border border-ink-border transition-colors hover:bg-ink-raised"
              >
                <X className="size-4" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="services" className="border-ink-border">
                <AccordionTrigger className="text-ink-foreground hover:text-[var(--accent)]">
                  Services
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-4 pb-2 pt-1">
                    {categories.map((cat) => {
                      const groups = groupsInCategory(cat.slug);
                      const topServices = groups.flatMap((g) => g.items).slice(0, 3);
                      return (
                        <div key={cat.slug} className="space-y-2">
                          <Link
                            href={`/services#${cat.slug}`}
                            onClick={() => setOpen(false)}
                            className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--accent)]"
                          >
                            {cat.title}
                          </Link>
                          <ul className="space-y-1">
                            {topServices.map((s) => (
                              <li key={s.slug}>
                                <Link
                                  href={`/services/${s.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="block py-1 text-sm text-ink-foreground/90"
                                >
                                  {s.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                    <Link
                      href="/services"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1 pt-2 font-mono text-xs uppercase tracking-wider text-[var(--accent)]"
                    >
                      View all services <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 space-y-1">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "All services" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-ink-border p-5">
            <Button asChild className="w-full">
              <Link href="/contact" onClick={() => setOpen(false)}>
                Get started
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="mt-3 flex items-center justify-center gap-2 font-mono text-xs text-ink-muted"
            >
              <Phone className="size-3.5" aria-hidden />
              {site.phone}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
