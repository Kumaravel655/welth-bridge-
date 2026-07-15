"use client";

import { CalendarClock, Check, Loader2, X } from "lucide-react";
import * as React from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminApi, type AdminConsultation } from "@/lib/admin-api";
import { PortalApiError } from "@/lib/portal-api";
import { site } from "@/lib/site";

const OFFICES = site.offices.map((o) => o.city);
const STATUS_FILTERS = ["all", "requested", "confirmed", "completed", "cancelled"] as const;

// Mirrors the backend's working hours: Mon–Sat, 10:00–17:30, 30-min slots.
const ALL_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const h = 10 + Math.floor(i / 2);
  return `${String(h).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`;
});

const selectClass =
  "flex h-9 rounded-xl border border-border bg-card px-3 text-sm shadow-xs transition-colors focus-visible:border-ring";

function ManagePanel({
  consultation,
  onSaved,
  onError,
}: {
  consultation: AdminConsultation;
  onSaved: (updated: AdminConsultation) => void;
  onError: (msg: string) => void;
}) {
  const [date, setDate] = React.useState(consultation.preferred_date);
  const [slot, setSlot] = React.useState(consultation.slot);
  const [office, setOffice] = React.useState(consultation.office);
  const [meetingLink, setMeetingLink] = React.useState(consultation.meeting_link ?? "");
  const [busy, setBusy] = React.useState<string | null>(null);

  async function apply(status?: string) {
    setBusy(status ?? "save");
    onError("");
    try {
      const updated = await adminApi.updateConsultation(consultation.id, {
        preferred_date: date,
        slot,
        office,
        meeting_link: meetingLink,
        ...(status ? { status } : {}),
      });
      onSaved(updated);
    } catch (err) {
      onError(err instanceof PortalApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  const isRequested = consultation.status === "requested";
  const isConfirmed = consultation.status === "confirmed";

  return (
    <div className="mt-4 rounded-xl border border-border bg-background p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Date
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Time
          <select value={slot} onChange={(e) => setSlot(e.target.value)} className={selectClass}>
            {ALL_SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Office
          <select value={office} onChange={(e) => setOffice(e.target.value)} className={selectClass}>
            {OFFICES.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Meeting link (call/video)
          <Input
            type="url"
            placeholder="https://meet.google.com/…"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            className="h-9"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {isRequested && (
          <Button size="sm" onClick={() => apply("confirmed")} disabled={busy !== null}>
            {busy === "confirmed" ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
            Accept &amp; confirm
          </Button>
        )}
        {(isRequested || isConfirmed) && (
          <Button size="sm" variant="outline" onClick={() => apply()} disabled={busy !== null}>
            {busy === "save" ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Save changes
          </Button>
        )}
        {isConfirmed && (
          <Button size="sm" variant="outline" onClick={() => apply("completed")} disabled={busy !== null}>
            {busy === "completed" ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Mark completed
          </Button>
        )}
        {(isRequested || isConfirmed) && (
          <Button size="sm" variant="ghost" onClick={() => apply("cancelled")} disabled={busy !== null}>
            {busy === "cancelled" ? <Loader2 className="animate-spin" aria-hidden /> : <X aria-hidden />}
            Cancel appointment
          </Button>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Confirming or cancelling emails the client automatically.
      </p>
    </div>
  );
}

export default function AdminAppointmentsPage() {
  const [items, setItems] = React.useState<AdminConsultation[] | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<(typeof STATUS_FILTERS)[number]>("all");
  const [officeFilter, setOfficeFilter] = React.useState("all");
  const [openId, setOpenId] = React.useState<number | null>(null);
  const [error, setError] = React.useState("");

  const load = React.useCallback(() => {
    adminApi
      .listConsultations({
        status: statusFilter === "all" ? undefined : statusFilter,
        office: officeFilter === "all" ? undefined : officeFilter,
      })
      .then(setItems)
      .catch(() => setError("Could not load appointments — is the backend running?"));
  }, [statusFilter, officeFilter]);

  React.useEffect(() => {
    setItems(null);
    load();
  }, [load]);

  const byDate = React.useMemo(() => {
    const groups = new Map<string, AdminConsultation[]>();
    for (const c of items ?? []) {
      const list = groups.get(c.preferred_date) ?? [];
      list.push(c);
      groups.set(c.preferred_date, list);
    }
    return [...groups.entries()];
  }, [items]);

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight">Appointments</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Accept, reschedule and assign bookings across the three offices.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number])}
              className={selectClass}
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All" : s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Office</span>
            <select value={officeFilter} onChange={(e) => setOfficeFilter(e.target.value)} className={selectClass}>
              <option value="all">All offices</option>
              {OFFICES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        {items === null && !error && (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Loading…
          </div>
        )}

        {items?.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">No appointments match these filters.</p>
        )}

        <div className="mt-8 space-y-8">
          {byDate.map(([date, list]) => (
            <section key={date}>
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <ul className="mt-3 space-y-3">
                {list.map((c) => (
                  <li key={c.id} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                          <CalendarClock className="size-4" aria-hidden />
                        </span>
                        <div>
                          <p className="font-medium">
                            {c.slot} — {c.client_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="capitalize">{c.mode}</span> · {c.office} office · {c.client_phone} ·{" "}
                            {c.client_email}
                          </p>
                          {c.notes && <p className="mt-1 text-sm text-muted-foreground">“{c.notes}”</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={c.status} />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setOpenId(openId === c.id ? null : c.id)}
                        >
                          {openId === c.id ? "Close" : "Manage"}
                        </Button>
                      </div>
                    </div>
                    {openId === c.id && (
                      <ManagePanel
                        consultation={c}
                        onSaved={() => {
                          setOpenId(null);
                          load();
                        }}
                        onError={setError}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
