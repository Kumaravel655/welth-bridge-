import { ArrowRight, CalendarClock, Mail, MapPin, Phone, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SceneArt } from "@/components/art/scene-art";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to The Wealth Bridge — offices in Vellore, Arakkonam and Ranipet, Tamil Nadu. Book a free consultation on company registration, tax and compliance.",
  alternates: { canonical: "/contact" },
};

const bookingSteps = [
  {
    icon: UserRound,
    title: "Sign in or create an account",
    body: "One account for bookings, service requests and every document we exchange.",
  },
  {
    icon: CalendarClock,
    title: "Pick a slot that suits you",
    body: "Phone call, video call, or a visit to whichever of our three offices is closest — Mon–Sat, 10:00 to 18:00.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-background text-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
              Contact
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              How can we <em className="text-accent-strong">assist you?</em>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Book a consultation and talk to us directly — the first one is
              free, and you&apos;ll leave it knowing exactly what to file, what
              it costs and how long it takes.
            </p>
          </div>
          <SceneArt
            variant="map"
            className="aspect-[4/3] border border-border shadow-xl shadow-black/10"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                Book a free consultation
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Start by booking a slot — for advice, a fee enquiry, or just to
                find out which registrations you actually need. Consultations
                are scheduled through your client account, so everything that
                follows — advice, requests, documents — stays in one place.
              </p>

              <ul className="mt-8 space-y-6">
                {bookingSteps.map((step) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                      <step.icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/portal/consultations">
                    Sign in &amp; book
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/portal/sign-up">Create an account</Link>
                </Button>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                Prefer to talk?
              </h2>
              <ul className="mt-5 space-y-3">
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-3 text-sm transition-colors hover:text-accent-strong"
                  >
                    <Phone className="size-4 text-accent-strong" aria-hidden />
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${site.phoneAlt.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-3 text-sm transition-colors hover:text-accent-strong"
                  >
                    <Phone className="size-4 text-accent-strong" aria-hidden />
                    {site.phoneAlt}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-3 text-sm transition-colors hover:text-accent-strong"
                  >
                    <Mail className="size-4 text-accent-strong" aria-hidden />
                    {site.email}
                  </a>
                </li>
              </ul>
            </Reveal>

            <RevealGroup className="mt-10 space-y-5">
              {site.offices.map((o) => (
                <Reveal key={o.city}>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <MapPin
                        className="mt-1 size-4 shrink-0 text-accent-strong"
                        aria-hidden
                      />
                      <div>
                        <p className="font-medium">
                          {o.city}{" "}
                          <span className="ml-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
                            {o.label}
                          </span>
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {o.address}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          {o.phones.map((phone) => (
                            <a
                              key={phone}
                              href={`tel:${phone.replace(/\s/g, "")}`}
                              className="font-mono text-xs text-muted-foreground transition-colors hover:text-accent-strong"
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>
    </>
  );
}
