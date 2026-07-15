"use client";

import * as Label from "@radix-ui/react-label";
import { ArrowRight, CalendarClock, Loader2, MapPin, Video } from "lucide-react";
import * as React from "react";

import { PortalNav } from "@/components/portal/portal-nav";
import { StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SegmentedToggle } from "@/components/ui/segmented-toggle";
import {
  portalApi,
  type ConsultationRecord,
  type ConsultationSlot,
  PortalApiError,
} from "@/lib/portal-api";
import { site } from "@/lib/site";

const MODE_OPTIONS: { value: "call" | "video" | "office"; label: string }[] = [
  { value: "call", label: "Call" },
  { value: "video", label: "Video" },
  { value: "office", label: "In-office" },
];

const HEAD_OFFICE = site.offices[0].city; // call/video consultations are handled from here

export default function PortalConsultationsPage() {
  const [consultations, setConsultations] = React.useState<ConsultationRecord[] | null>(null);
  const [date, setDate] = React.useState("");
  const [slots, setSlots] = React.useState<ConsultationSlot[]>([]);
  const [mode, setMode] = React.useState<"call" | "video" | "office">("call");
  const [office, setOffice] = React.useState<string>(HEAD_OFFICE);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [cancellingId, setCancellingId] = React.useState<number | null>(null);

  // Call/video bookings are scheduled against the head office's calendar;
  // the office picker only applies to in-person visits.
  const effectiveOffice = mode === "office" ? office : HEAD_OFFICE;

  const loadConsultations = React.useCallback(() => {
    portalApi.listConsultations().then(setConsultations).catch(() => {});
  }, []);

  React.useEffect(() => {
    loadConsultations();
  }, [loadConsultations]);

  React.useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    portalApi.getSlots(date, effectiveOffice).then(setSlots).catch(() => setSlots([]));
  }, [date, effectiveOffice]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);
    const slot = String(data.get("slot") ?? "");
    const notes = String(data.get("notes") ?? "");

    try {
      await portalApi.createConsultation({
        preferred_date: date,
        slot,
        mode,
        office: effectiveOffice,
        notes,
      });
      setStatus("idle");
      setDate("");
      setSlots([]);
      loadConsultations();
    } catch (err) {
      setErrorMsg(err instanceof PortalApiError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  async function handleCancel(id: number) {
    setCancellingId(id);
    try {
      await portalApi.cancelConsultation(id);
      loadConsultations();
    } catch {
      // list reload below will show the true state either way
    } finally {
      setCancellingId(null);
    }
  }

  const openSlots = slots.filter((s) => s.available);

  return (
    <>
      <PortalNav />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight">Consultations</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Book a free slot for advice or a fee enquiry — phone, video, or in
          person at any of our three offices. We&apos;ll confirm your booking
          by email.
        </p>

        <div className="mt-6">
          {consultations === null && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Loading…
            </div>
          )}
          {consultations?.length === 0 && (
            <p className="text-sm text-muted-foreground">No consultations booked yet.</p>
          )}
          {consultations && consultations.length > 0 && (
            <ul className="space-y-3">
              {consultations.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent-strong">
                      <CalendarClock className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium">
                        {c.preferred_date} · {c.slot}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="capitalize">{c.mode}</span>
                        {c.mode === "office" && (
                          <>
                            {" "}
                            · <MapPin className="inline size-3.5" aria-hidden /> {c.office} office
                          </>
                        )}
                      </p>
                      {c.status === "confirmed" && c.meeting_link && (
                        <a
                          href={c.meeting_link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:underline"
                        >
                          <Video className="size-3.5" aria-hidden />
                          Join meeting
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.status} />
                    {(c.status === "requested" || c.status === "confirmed") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancel(c.id)}
                        disabled={cancellingId !== null}
                      >
                        {cancellingId === c.id ? (
                          <Loader2 className="animate-spin" aria-hidden />
                        ) : null}
                        Cancel
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl tracking-tight">Book a consultation</h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-sm font-medium">Mode</Label.Root>
              <SegmentedToggle options={MODE_OPTIONS} value={mode} onChange={setMode} />
            </div>

            {mode === "office" && (
              <div className="flex flex-col gap-1.5">
                <Label.Root htmlFor="office" className="text-sm font-medium">
                  Which office suits you?
                </Label.Root>
                <select
                  id="office"
                  value={office}
                  onChange={(e) => setOffice(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm shadow-xs transition-colors focus-visible:border-ring"
                >
                  {site.offices.map((o) => (
                    <option key={o.city} value={o.city}>
                      {o.city} — {o.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {site.offices.find((o) => o.city === office)?.address}
                </p>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label.Root htmlFor="date" className="text-sm font-medium">
                  Preferred date
                </Label.Root>
                <Input
                  id="date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Mon–Sat, 10:00–18:00. Closed Sundays.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root htmlFor="slot" className="text-sm font-medium">
                  Time slot
                </Label.Root>
                <select
                  id="slot"
                  name="slot"
                  required
                  disabled={openSlots.length === 0}
                  defaultValue=""
                  className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm shadow-xs transition-colors focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>
                    {!date
                      ? "Pick a date first"
                      : openSlots.length === 0
                        ? "No slots free that day"
                        : "Select a time"}
                  </option>
                  {openSlots.map((s) => (
                    <option key={s.slot} value={s.slot}>
                      {s.slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root htmlFor="notes" className="text-sm font-medium">
                Notes (optional)
              </Label.Root>
              <Textarea id="notes" name="notes" placeholder="Anything we should know beforehand?" />
            </div>

            {status === "error" && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {errorMsg}
              </p>
            )}

            <Button type="submit" disabled={status === "submitting" || !date}>
              {status === "submitting" ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden />
                  Booking…
                </>
              ) : (
                <>
                  Book consultation
                  <ArrowRight aria-hidden />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
