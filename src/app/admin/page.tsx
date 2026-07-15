"use client";

import {
  CalendarClock,
  CalendarCheck2,
  FolderOpen,
  Loader2,
  Mail,
  Send,
  Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { StatusBadge } from "@/components/portal/status-badge";
import { adminApi, type AdminConsultation, type AdminStats } from "@/lib/admin-api";

const CARDS: {
  key: keyof AdminStats;
  label: string;
  href: string;
  icon: React.ElementType;
}[] = [
  { key: "pending_consultations", label: "Appointments awaiting action", href: "/admin/appointments", icon: CalendarClock },
  { key: "upcoming_consultations", label: "Confirmed appointments", href: "/admin/appointments", icon: CalendarCheck2 },
  { key: "open_requests", label: "Open service requests", href: "/admin/requests", icon: FolderOpen },
  { key: "clients", label: "Registered clients", href: "/admin/clients", icon: Users },
  { key: "confirmed_subscribers", label: "Newsletter subscribers", href: "/admin/newsletter", icon: Mail },
  { key: "newsletters_sent", label: "Newsletters sent", href: "/admin/newsletter", icon: Send },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [pending, setPending] = React.useState<AdminConsultation[] | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    adminApi.stats().then(setStats).catch(() => setError("Could not load stats — is the backend running?"));
    adminApi
      .listConsultations({ status: "requested" })
      .then(setPending)
      .catch(() => setPending([]));
  }, []);

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight">Dashboard</h1>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {!stats && !error && (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading…
          </div>
        )}

        {stats && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map(({ key, label, href, icon: Icon }) => (
              <Link
                key={`${key}-${label}`}
                href={href}
                className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="font-display text-3xl tracking-tight">{stats[key]}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground group-hover:text-foreground">{label}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl tracking-tight">Awaiting your response</h2>
            <Link href="/admin/appointments" className="text-sm font-medium text-accent-strong hover:underline">
              All appointments
            </Link>
          </div>
          {pending === null && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Loading…
            </div>
          )}
          {pending?.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              No appointment requests waiting — you&apos;re all caught up.
            </p>
          )}
          {pending && pending.length > 0 && (
            <ul className="mt-4 space-y-3">
              {pending.slice(0, 5).map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
                >
                  <div>
                    <p className="font-medium">
                      {c.client_name}{" "}
                      <span className="text-sm font-normal text-muted-foreground">· {c.client_phone}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {c.preferred_date} at {c.slot} · <span className="capitalize">{c.mode}</span> · {c.office}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
