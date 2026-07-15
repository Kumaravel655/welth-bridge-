"use client";

import { Loader2, Mail, PenLine, Send } from "lucide-react";
import * as React from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { StatusBadge } from "@/components/portal/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  adminApi,
  type AdminNewsletter,
  type AdminSubscriber,
} from "@/lib/admin-api";
import { PortalApiError } from "@/lib/portal-api";

export default function AdminNewsletterPage() {
  const [newsletters, setNewsletters] = React.useState<AdminNewsletter[] | null>(null);
  const [subscribers, setSubscribers] = React.useState<AdminSubscriber[] | null>(null);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [sendingId, setSendingId] = React.useState<number | null>(null);

  const load = React.useCallback(() => {
    adminApi
      .listNewsletters()
      .then(setNewsletters)
      .catch(() => setError("Could not load newsletters — is the backend running?"));
    adminApi.listSubscribers().then(setSubscribers).catch(() => setSubscribers([]));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const confirmedCount = subscribers?.filter((s) => s.status === "confirmed").length ?? 0;

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = String(data.get("subject") ?? "").trim();
    const body = String(data.get("body") ?? "").trim();
    if (!subject || !body) return;

    setCreating(true);
    setError("");
    setNotice("");
    try {
      await adminApi.createNewsletter({ subject, body_mdx: body });
      form.reset();
      setNotice("Draft saved. Send it from the list below when you're ready.");
      load();
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "Something went wrong.");
    } finally {
      setCreating(false);
    }
  }

  async function handleSend(id: number) {
    setSendingId(id);
    setError("");
    setNotice("");
    try {
      const result = await adminApi.sendNewsletter(id);
      setNotice(`Sending to ${result.recipients} subscriber${result.recipients === 1 ? "" : "s"}…`);
      load();
    } catch (err) {
      setError(err instanceof PortalApiError ? err.message : "Something went wrong.");
    } finally {
      setSendingId(null);
    }
  }

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl tracking-tight">Newsletter</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {confirmedCount} confirmed subscriber{confirmedCount === 1 ? "" : "s"} will receive each send.
        </p>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-6 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent-strong">
            {notice}
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-display text-xl tracking-tight">
                <PenLine className="size-4 text-accent-strong" aria-hidden />
                Compose
              </h2>
              <form onSubmit={handleCreate} className="mt-4 space-y-4">
                <Input name="subject" required aria-label="Subject" placeholder="Subject line" />
                <Textarea
                  name="body"
                  required
                  rows={8}
                  aria-label="Newsletter body"
                  placeholder={"Write your update…\n\nLeave a blank line between paragraphs."}
                />
                <Button type="submit" disabled={creating}>
                  {creating ? <Loader2 className="animate-spin" aria-hidden /> : null}
                  Save draft
                </Button>
              </form>
            </div>

            <h2 className="mt-8 font-display text-xl tracking-tight">Past &amp; drafts</h2>
            {newsletters === null && !error && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Loading…
              </div>
            )}
            {newsletters?.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">Nothing composed yet.</p>
            )}
            {newsletters && newsletters.length > 0 && (
              <ul className="mt-4 space-y-3">
                {newsletters.map((n) => (
                  <li
                    key={n.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="min-w-0">
                      <p className="font-medium">{n.subject}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {n.status === "sent" && n.sent_at
                          ? `Sent ${new Date(n.sent_at).toLocaleString("en-IN")}`
                          : `Created ${new Date(n.created_at).toLocaleDateString("en-IN")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={n.status} />
                      {(n.status === "draft" || n.status === "scheduled") && (
                        <Button
                          size="sm"
                          onClick={() => handleSend(n.id)}
                          disabled={sendingId !== null || confirmedCount === 0}
                        >
                          {sendingId === n.id ? (
                            <Loader2 className="animate-spin" aria-hidden />
                          ) : (
                            <Send aria-hidden />
                          )}
                          Send now
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-display text-xl tracking-tight">
              <Mail className="size-4 text-accent-strong" aria-hidden />
              Subscribers
            </h2>
            {subscribers === null && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Loading…
              </div>
            )}
            {subscribers?.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                No subscribers yet — signups from the site footer land here.
              </p>
            )}
            {subscribers && subscribers.length > 0 && (
              <ul className="mt-4 space-y-2">
                {subscribers.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
                  >
                    <span className="min-w-0 truncate">{s.email}</span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      {s.source && <span className="hidden sm:inline">{s.source}</span>}
                      <StatusBadge status={s.status} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
