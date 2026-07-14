"use client";

import { ArrowRight, CalendarClock, FileText, Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { PortalNav } from "@/components/portal/portal-nav";
import { Button } from "@/components/ui/button";
import { portalApi, type UserProfile } from "@/lib/portal-api";

export default function PortalDashboardPage() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    portalApi
      .me()
      .then(setProfile)
      .catch(() => setError("Couldn't load your profile. Try refreshing the page."));
  }, []);

  return (
    <>
      <PortalNav />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {!profile && !error && (
          <div className="flex items-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading your dashboard…
          </div>
        )}

        {profile && (
          <>
            <h1 className="font-display text-3xl tracking-tight">
              Welcome back, {profile.name.split(" ")[0]}.
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Link
                href="/portal/requests"
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                    <FileText className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-display text-2xl tracking-tight">
                      {profile.open_requests_count}
                    </p>
                    <p className="text-sm text-muted-foreground">Open service requests</p>
                  </div>
                </div>
                <ArrowRight
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>

              <Link
                href="/portal/consultations"
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                    <CalendarClock className="size-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-display text-2xl tracking-tight">
                      {profile.upcoming_consults_count}
                    </p>
                    <p className="text-sm text-muted-foreground">Upcoming consultations</p>
                  </div>
                </div>
                <ArrowRight
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>

            <Button asChild size="lg" className="mt-8">
              <Link href="/portal/requests/new">
                <PlusCircle aria-hidden />
                Submit a new request
              </Link>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
