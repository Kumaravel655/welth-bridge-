import { Facebook, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { featuredServices } from "@/lib/services";
import { site } from "@/lib/site";

import { Wordmark } from "./wordmark";

export function Footer() {
  return (
    <footer className="relative rounded-t-3xl bg-ink text-ink-foreground">
      {/* Gradient divider at top */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <RevealGroup className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <Reveal variant="fade-right">
            <Wordmark onDark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              One-stop business setup and compliance partner since 2007 —
              helping founders form, fund and run companies from Vellore,
              Tamil Nadu.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="The Wealth Bridge on Facebook"
                className="group inline-flex size-9 items-center justify-center rounded-full border border-ink-border transition-all duration-300 hover:border-[var(--accent-on-ink)] hover:text-[var(--accent-on-ink)] hover:shadow-[0_0_12px_-3px] hover:shadow-accent/30"
              >
                <Facebook className="size-4" aria-hidden />
              </a>
              <a
                href={site.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="The Wealth Bridge on Twitter"
                className="group inline-flex size-9 items-center justify-center rounded-full border border-ink-border transition-all duration-300 hover:border-[var(--accent-on-ink)] hover:text-[var(--accent-on-ink)] hover:shadow-[0_0_12px_-3px] hover:shadow-accent/30"
              >
                <Twitter className="size-4" aria-hidden />
              </a>
            </div>
            <NewsletterForm variant="footer" source="footer" />
          </Reveal>

          {/* Popular services */}
          <Reveal variant="fade-up">
            <nav aria-label="Popular services">
              <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                Popular services
              </p>
              <ul className="space-y-2">
                {featuredServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-sm text-ink-foreground/85 transition-colors hover:text-[var(--accent-on-ink)]"
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Company */}
          <Reveal variant="fade-up">
            <nav aria-label="Company">
              <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                Company
              </p>
              <ul className="space-y-2">
                {[
                  { href: "/about", label: "About us" },
                  { href: "/services", label: "All services" },
                  { href: "/tools", label: "Tools" },
                  { href: "/blog", label: "Blog" },
                  { href: "/downloads", label: "Download centre" },
                  { href: "/compliance-calendar", label: "Compliance calendar" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ink-foreground/85 transition-colors hover:text-[var(--accent-on-ink)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mb-3 mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                Reach us
              </p>
              <ul className="space-y-2 text-sm text-ink-foreground/85">
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-[var(--accent-on-ink)]"
                  >
                    <Phone className="size-3.5 shrink-0" aria-hidden />
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-[var(--accent-on-ink)]"
                  >
                    <Mail className="size-3.5 shrink-0" aria-hidden />
                    {site.email}
                  </a>
                </li>
              </ul>
            </nav>
          </Reveal>

          {/* Offices */}
          <Reveal variant="fade-left">
            <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
              Offices
            </p>
            <ul className="space-y-4">
              {site.offices.map((o) => (
                <li key={o.city} className="flex gap-2.5 text-sm">
                  <MapPin
                    className="mt-0.5 size-3.5 shrink-0 text-[var(--accent-on-ink)]"
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium">{o.city}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                      {o.address}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </RevealGroup>

        <Reveal variant="fade-up">
          <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-ink-border pt-6 sm:flex-row">
            <p className="text-xs text-ink-muted">
              © {new Date().getFullYear()} The Wealth Bridge. All rights
              reserved.
            </p>
            <p className="text-xs text-ink-muted">
              Developed &amp; maintained by{" "}
              <a
                href="https://velandev.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink-foreground/85 transition-colors hover:text-[var(--accent-on-ink)]"
              >
                VelanDev
              </a>
            </p>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted">
              Vellore · Arakkonam · Ranipet
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
