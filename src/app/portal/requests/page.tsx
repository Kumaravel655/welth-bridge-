"use client";

import { ArrowRight, Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { PortalNav } from "@/components/portal/portal-nav";
import { StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { getService } from "@/lib/services";
import { portalApi, type ServiceRequestRecord } from "@/lib/portal-api";

export default function PortalRequestsPage() {
  const [requests, setRequests] = React.useState<ServiceRequestRecord[] | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    portalApi
      .listRequests()
      .then(setRequests)
      .catch(() => setError("Couldn't load your requests. Try refreshing the page."));
  }, []);

  return (
    <>
      <PortalNav />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-3xl tracking-tight">Your requests</h1>
          <Button asChild size="sm">
            <Link href="/portal/requests/new">
              <PlusCircle aria-hidden />
              New request
            </Link>
          </Button>
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {!requests && !error && (
          <div className="flex items-center gap-2 py-16 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading your requests…
          </div>
        )}

        {requests && requests.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">
            You haven&apos;t submitted any service requests yet.
          </p>
        )}

        {requests && requests.length > 0 && (
          <ul className="mt-6 space-y-3">
            {requests.map((req) => {
              const service = getService(req.service_slug);
              return (
                <li key={req.id}>
                  <Link
                    href={`/portal/requests/${req.id}`}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent/50 hover:shadow-md"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{req.title}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {service?.name ?? req.service_slug}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={req.status} />
                      <ArrowRight
                        className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
