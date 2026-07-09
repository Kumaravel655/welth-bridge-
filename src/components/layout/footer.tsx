import { Facebook, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Link from "next/link";

import { featuredServices } from "@/lib/services";
import { site } from "@/lib/site";

import { Wordmark } from "./wordmark";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Wordmark />
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
                className="inline-flex size-9 items-center justify-center rounded-full border border-ink-border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Facebook className="size-4" aria-hidden />
              </a>
              <a
                href={site.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="The Wealth Bridge on Twitter"
                className="inline-flex size-9 items-center justify-center rounded-full border border-ink-border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Twitter className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          {/* Popular services */}
          <nav aria-label="Popular services">
            <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
              Popular services
            </p>
            <ul className="space-y-2">
              {featuredServices.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-ink-foreground/85 transition-colors hover:text-[var(--accent)]"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
              Company
            </p>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About us" },
                { href: "/services", label: "All services" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-foreground/85 transition-colors hover:text-[var(--accent)]"
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
                  className="inline-flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
                >
                  <Phone className="size-3.5 shrink-0" aria-hidden />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
                >
                  <Mail className="size-3.5 shrink-0" aria-hidden />
                  {site.email}
                </a>
              </li>
            </ul>
          </nav>

          {/* Offices */}
          <div>
            <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
              Offices
            </p>
            <ul className="space-y-4">
              {site.offices.map((o) => (
                <li key={o.city} className="flex gap-2.5 text-sm">
                  <MapPin
                    className="mt-0.5 size-3.5 shrink-0 text-[var(--accent)]"
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
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-ink-border pt-6 sm:flex-row">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} The Wealth Bridge. All rights
            reserved.
          </p>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted">
            Vellore · Arakkonam · Ranipet
          </p>
        </div>
      </div>
    </footer>
  );
}
