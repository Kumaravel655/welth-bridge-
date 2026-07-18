import { ArrowRight, CalendarClock, Mail, MapPin, Phone, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

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
      {/* Hero */}
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/saas-abstract-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent-on-ink backdrop-blur-md mb-6">
              Contact
            </span>
            <h1 className="mx-auto max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl text-white">
              How can we <em className="text-accent-on-ink">assist you?</em>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Book a consultation and talk to us directly — the first one is
              free, and you&apos;ll leave it knowing exactly what to file, what
              it costs and how long it takes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Grid Section (Parallax Background) */}
      <section 
        className="relative overflow-hidden py-24 sm:py-32 bg-slate-50 dark:bg-slate-950"
        style={{
          backgroundImage: 'url(/images/backgrounds/colorful-office-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-slate-50 from-40% via-slate-50/80 to-slate-50/10 dark:from-slate-950 dark:via-slate-950/80 dark:to-slate-950/10 z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
            
            {/* Booking Card */}
            <Reveal>
              <div className="rounded-3xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-8 sm:p-10 shadow-xl transition-all hover:shadow-2xl hover:shadow-accent/[0.08]">
                <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                  Book a free consultation
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                  Start by booking a slot — for advice, a fee enquiry, or just to
                  find out which registrations you actually need. Consultations
                  are scheduled through your client account, so everything that
                  follows — advice, requests, documents — stays in one place.
                </p>

                <ul className="mt-10 space-y-8">
                  {bookingSteps.map((step) => (
                    <li key={step.title} className="flex items-start gap-5">
                      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent-strong">
                        <step.icon className="size-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-lg font-semibold">{step.title}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-xl px-8">
                    <Link href="/portal/consultations">
                      Sign in &amp; book
                      <ArrowRight aria-hidden className="ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-xl px-8 border-accent/20 hover:bg-accent/5">
                    <Link href="/portal/sign-up">Create an account</Link>
                  </Button>
                </div>
              </div>
            </Reveal>

            {/* Direct Contact & Offices */}
            <div>
              <Reveal>
                <div className="rounded-3xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-8 sm:p-10 shadow-xl mb-6">
                  <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                    Prefer to talk?
                  </h2>
                  <ul className="mt-6 space-y-4">
                    <li>
                      <a
                        href={`tel:${site.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-3 text-base font-medium transition-colors hover:text-accent-strong"
                      >
                        <Phone className="size-5 text-accent-strong" aria-hidden />
                        {site.phone}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`tel:${site.phoneAlt.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-3 text-base font-medium transition-colors hover:text-accent-strong"
                      >
                        <Phone className="size-5 text-accent-strong" aria-hidden />
                        {site.phoneAlt}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`mailto:${site.email}`}
                        className="inline-flex items-center gap-3 text-base font-medium transition-colors hover:text-accent-strong"
                      >
                        <Mail className="size-5 text-accent-strong" aria-hidden />
                        {site.email}
                      </a>
                    </li>
                  </ul>
                </div>
              </Reveal>

              <RevealGroup className="space-y-6">
                {site.offices.map((o) => (
                  <Reveal key={o.city}>
                    <div className="rounded-3xl border border-border bg-white/85 dark:bg-slate-900/85 backdrop-blur-md p-6 shadow-md transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/[0.05]">
                      <div className="flex items-start gap-4">
                        <MapPin
                          className="mt-1 size-5 shrink-0 text-accent-strong"
                          aria-hidden
                        />
                        <div>
                          <p className="font-semibold text-lg">
                            {o.city}{" "}
                            <span className="ml-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent-strong/80">
                              {o.label}
                            </span>
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {o.address}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
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
        </div>
      </section>
    </>
  );
}
