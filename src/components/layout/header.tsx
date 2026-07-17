"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  ArrowRight,
  Building2,
  Calculator,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  Copyright,
  Download,
  FileCheck2,
  HandCoins,
  HeartHandshake,
  Landmark,
  Menu,
  Newspaper,
  Percent,
  Phone,
  Rocket,
  type LucideIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { SiteSearch } from "@/components/shared/site-search";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { featuredPosts } from "@/lib/blog";
import { categories, groupsInCategory } from "@/lib/services";
import { site } from "@/lib/site";
import { toolCategories, tools, toolsByCategory } from "@/lib/tools";
import { cn } from "@/lib/utils";

import { Wordmark } from "./wordmark";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 text-foreground backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <DesktopNav />

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="mr-1 hidden shrink-0 items-center gap-2 whitespace-nowrap font-mono text-xs text-muted-foreground transition-colors hover:text-foreground xl:inline-flex"
          >
            <Phone className="size-3.5" aria-hidden />
            {site.phone}
          </a>
          <SiteSearch />
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/portal/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/portal/consultations">
              Book consultation
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
  "group inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground";

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
          <NavigationMenu.Trigger className={triggerClass} suppressHydrationWarning>
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

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClass} suppressHydrationWarning>
            Tools
            <ChevronDown
              className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-max">
            <AllToolsPanel />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClass} suppressHydrationWarning>
            Resources
            <ChevronDown
              className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute left-0 top-0 w-max">
            <AllResourcesPanel />
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
        <NavigationMenu.Viewport className="relative h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] origin-top overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 transition-[width,height] duration-200" />
      </div>
    </NavigationMenu.Root>
  );
}

// Shared position-based icon tints — used wherever a dropdown renders a flat
// list of icon rows (Services, Tools, Resources), so all three read as one
// consistent design language rather than each inventing its own palette.
const ICON_TINTS = [
  "bg-accent/10 text-accent-strong",
  "bg-emerald-500/10 text-emerald-600",
  "bg-amber-500/10 text-amber-600",
  "bg-violet-500/10 text-violet-600",
  "bg-rose-500/10 text-rose-600",
];

function MenuIconRow({
  href,
  icon: Icon,
  tint,
  title,
  subtitle,
}: {
  href: string;
  icon: LucideIcon;
  tint: string;
  title: string;
  subtitle: string;
}) {
  return (
    <NavigationMenu.Link asChild>
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
      >
        <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-lg", tint)}>
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">{title}</span>
          <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
        </span>
        <ChevronRight
          className="size-4 shrink-0 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden
        />
      </Link>
    </NavigationMenu.Link>
  );
}

const SERVICE_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "start-a-business": Building2,
  "tax-compliance": FileCheck2,
  "trademark-ip": Copyright,
  funding: HandCoins,
  ngo: HeartHandshake,
};

function AllServicesPanel() {
  return (
    <div className="w-[360px] max-w-[90vw] p-3">
      <div className="mb-2 flex items-end justify-between gap-6 px-3 pb-3 pt-2">
        <div>
          <p className="font-display text-lg text-foreground">Our Services</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Comprehensive solutions for your business</p>
        </div>
        <NavigationMenu.Link asChild>
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--accent)] hover:underline"
          >
            View all
            <ArrowRight className="size-3" aria-hidden />
          </Link>
        </NavigationMenu.Link>
      </div>

      <ul className="space-y-1">
        {categories.map((cat, i) => (
          <li key={cat.slug}>
            <MenuIconRow
              href={`/services#${cat.slug}`}
              icon={SERVICE_CATEGORY_ICONS[cat.slug] ?? Building2}
              tint={ICON_TINTS[i % ICON_TINTS.length]}
              title={cat.title}
              subtitle={cat.tagline}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const TOOL_ICONS: Record<string, LucideIcon> = {
  "emi-calculator": Calculator,
  "gst-calculator": Percent,
  "income-tax-calculator": Landmark,
  "startup-eligibility-checker": Rocket,
  "funding-eligibility-checker": HandCoins,
};

function AllToolsPanel() {
  return (
    <div className="w-[360px] max-w-[90vw] p-3">
      <div className="mb-2 flex items-end justify-between gap-6 px-3 pb-3 pt-2">
        <div>
          <p className="font-display text-lg text-foreground">Free Tools</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Calculators &amp; eligibility checkers</p>
        </div>
        <NavigationMenu.Link asChild>
          <Link
            href="/tools"
            className="inline-flex shrink-0 items-center gap-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[var(--accent)] hover:underline"
          >
            View all
            <ArrowRight className="size-3" aria-hidden />
          </Link>
        </NavigationMenu.Link>
      </div>

      <ul className="space-y-1">
        {tools.map((tool, i) => (
          <li key={tool.slug}>
            <MenuIconRow
              href={`/tools/${tool.slug}`}
              icon={TOOL_ICONS[tool.slug] ?? Calculator}
              tint={ICON_TINTS[i % ICON_TINTS.length]}
              title={tool.name}
              subtitle={tool.short}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const RESOURCE_ROWS = [
  {
    href: "/blog",
    icon: Newspaper,
    title: "Blog",
    subtitle: "Guides on registration, GST, funding & compliance",
  },
  {
    href: "/downloads",
    icon: Download,
    title: "Download Centre",
    subtitle: "Free checklists & templates — ready to use",
  },
  {
    href: "/compliance-calendar",
    icon: CalendarClock,
    title: "Compliance Calendar",
    subtitle: "Every GST, tax & ROC due date in one place",
  },
];

function AllResourcesPanel() {
  return (
    <div className="w-[360px] max-w-[90vw] p-3">
      <ul className="space-y-1">
        {RESOURCE_ROWS.map((row, i) => (
          <li key={row.href}>
            <MenuIconRow
              href={row.href}
              icon={row.icon}
              tint={ICON_TINTS[i % ICON_TINTS.length]}
              title={row.title}
              subtitle={row.subtitle}
            />
          </li>
        ))}
      </ul>
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
          className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
        >
          <Menu className="size-4" aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-background text-foreground shadow-2xl focus:outline-none">
          <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <Wordmark />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                suppressHydrationWarning
                className="inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
              >
                <X className="size-4" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="services" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-[var(--accent)]">
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
                                  className="block py-1 text-sm text-foreground/90"
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

              <AccordionItem value="tools" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-[var(--accent)]">
                  Tools
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-4 pb-2 pt-1">
                    {toolCategories.map((cat) => (
                      <div key={cat.slug} className="space-y-2">
                        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--accent)]">
                          {cat.title}
                        </p>
                        <ul className="space-y-1">
                          {toolsByCategory(cat.slug).map((tool) => (
                            <li key={tool.slug}>
                              <Link
                                href={`/tools/${tool.slug}`}
                                onClick={() => setOpen(false)}
                                className="block py-1 text-sm text-foreground/90"
                              >
                                {tool.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link
                      href="/tools"
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-1 pt-2 font-mono text-xs uppercase tracking-wider text-[var(--accent)]"
                    >
                      View all tools <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="resources" className="border-border">
                <AccordionTrigger className="text-foreground hover:text-[var(--accent)]">
                  Resources
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-4 pb-2 pt-1">
                    <div className="space-y-2">
                      <Link
                        href="/blog"
                        onClick={() => setOpen(false)}
                        className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--accent)]"
                      >
                        Blog
                      </Link>
                      <ul className="space-y-1">
                        {featuredPosts.map((post) => (
                          <li key={post.slug}>
                            <Link
                              href={`/blog/${post.slug}`}
                              onClick={() => setOpen(false)}
                              className="block py-1 text-sm text-foreground/90"
                            >
                              {post.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/downloads"
                        onClick={() => setOpen(false)}
                        className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--accent)]"
                      >
                        Download centre
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/compliance-calendar"
                        onClick={() => setOpen(false)}
                        className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-[var(--accent)]"
                      >
                        Compliance calendar
                      </Link>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 space-y-1">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "All services" },
                { href: "/tools", label: "All tools" },
                { href: "/blog", label: "Blog" },
                { href: "/downloads", label: "Downloads" },
                { href: "/compliance-calendar", label: "Compliance calendar" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/portal/sign-in", label: "Sign in" },
                { href: "/portal/sign-up", label: "Create an account" },
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

          <div className="border-t border-border p-5">
            <Button asChild className="w-full">
              <Link href="/portal/consultations" onClick={() => setOpen(false)}>
                Book consultation
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="mt-3 flex items-center justify-center gap-2 whitespace-nowrap font-mono text-xs text-muted-foreground"
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
