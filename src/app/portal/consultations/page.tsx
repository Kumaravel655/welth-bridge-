"use client";

import * as Label from "@radix-ui/react-label";
import { ArrowRight, CalendarClock, Loader2 } from "lucide-react";
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

const MODE_OPTIONS: { value: "call" | "video" | "office"; label: string }[] = [
  { value: "call", label: "Call" },
  { value: "video", label: "Video" },
  { value: "office", label: "In-office" },
];

export default function PortalConsultationsPage() {
  const [consultations, setConsultations] = React.useState<ConsultationRecord[] | null>(null);
  const [date, setDate] = React.useState("");
  const [slots, setSlots] = React.useState<ConsultationSlot[]>([]);
  const [mode, setMode] = React.useState<"call" | "video" | "office">("call");
  const [status, setStatus] = React.useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

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
    portalApi.getSlots(date).then(setSlots).catch(() => setSlots([]));
  }, [date]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);
    const slot = String(data.get("slot") ?? "");
    const notes = String(data.get("notes") ?? "");

    try {
      await portalApi.createConsultation({ preferred_date: date, slot, mode, notes });
      setStatus("idle");
      setDate("");
      setSlots([]);
      loadConsultations();
    } catch (err) {
      setErrorMsg(err instanceof PortalApiError ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <>
      <PortalNav />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight">Consultations</h1>

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
                      <p className="text-sm capitalize text-muted-foreground">{c.mode}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl tracking-tight">Book a consultation</h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
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
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root htmlFor="slot" className="text-sm font-medium">
                  Time slot
                </Label.Root>
                <select
                  id="slot"
                  name="slot"
                  required
                  disabled={slots.length === 0}
                  defaultValue=""
                  className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm shadow-xs transition-colors focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>
                    {date ? "Select a time" : "Pick a date first"}
                  </option>
                  {slots
                    .filter((s) => s.available)
                    .map((s) => (
                      <option key={s.slot} value={s.slot}>
                        {s.slot}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label.Root className="text-sm font-medium">Mode</Label.Root>
              <SegmentedToggle options={MODE_OPTIONS} value={mode} onChange={setMode} />
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
